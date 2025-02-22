# -*- coding: utf-8 -*-
"""
TencentBlueKing is pleased to support the open source community by making
蓝鲸智云 - PaaS 平台 (BlueKing - PaaS System) available.
Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except
in compliance with the License. You may obtain a copy of the License at

    http://opensource.org/licenses/MIT

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the License for the specific language governing permissions and
limitations under the License.

We undertake not to change the open source license (MIT license) applicable
to the current version of the project delivered to anyone in the future.
"""
import logging
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Dict, List, Tuple

from django.core.exceptions import ObjectDoesNotExist

from paas_wl.monitoring.app_monitor.managers import make_bk_monitor_controller
from paas_wl.resources.actions.exceptions import BuildMissingError, ReleaseMissingError
from paas_wl.resources.base.exceptions import KubeException
from paas_wl.resources.utils.app import get_scheduler_client_by_app
from paas_wl.workloads.processes.constants import ProcessTargetStatus
from paas_wl.workloads.processes.managers import AppProcessManager
from paas_wl.workloads.processes.utils import get_command_name

if TYPE_CHECKING:
    from paas_wl.platform.applications.models.app import App
    from paas_wl.platform.applications.models.release import Release
    from paas_wl.resources.base.client import K8sScheduler
    from paas_wl.workloads.processes.models import Process

logger = logging.getLogger(__name__)


@dataclass
class AppDeploy:
    app: 'App'
    release: 'Release'
    extra_envs: Dict = field(default_factory=lambda: {}, metadata={"annotation": "envs from paasng"})

    def __post_init__(self):
        if not self.release:
            raise ReleaseMissingError(f"perform deploy action need to pass release, app_name={self.app.name}")

        if not self.release.build:
            raise BuildMissingError(f"no build related to release, app_name={self.app.name}")

        self.scheduler_client = get_scheduler_client_by_app(self.app)

    def perform(self):
        # update ProcessSpec.target_status to resume the process for those archived app
        self.app.process_specs.update(target_status=ProcessTargetStatus.START.value)

        # create namespace and image credentials secret before deploy for image app.
        self.scheduler_client.ensure_namespace(self.app.namespace)
        self.scheduler_client.ensure_image_credentials_secret(self.app)
        # update deploy info in scheduler module
        processes = AppProcessManager(app=self.app).assemble_processes(extra_envs=self.extra_envs)
        try:
            self.scheduler_client.deploy_processes(list(processes))
        except KubeException as e:
            self.release.fail(summary=f"deployed {str(self.release.uuid)[:7]} which failed for: {e}")
            raise
        finally:
            self.recycle_resource()
        self.ensure_bk_minitor_if_need()

    def recycle_resource(self):
        """回收上一次发布可能产生的僵尸进程"""
        try:
            previous_release = self.release.get_previous()
        except ObjectDoesNotExist:
            # 上一次部署不存在，不需要清理
            return

        logger.debug(
            "latest release: %s<%s> \n previous release: %s<%s>",
            self.release.pk,
            self.release.created,
            previous_release.pk,
            previous_release.created,
        )
        ZombieProcessesKiller(release=self.release, last_release=previous_release).kill(self.scheduler_client)

    def ensure_bk_minitor_if_need(self):
        """如果集群支持且应用声明需要接入蓝鲸监控, 则尝试下发监控配置"""
        try:
            # 下发 ServiceMonitor 配置
            make_bk_monitor_controller(self.app).create_or_patch()
        except KubeException:
            logger.exception("An error occur when creating ServiceMonitor")


@dataclass
class ZombieProcessesKiller:
    """
    僵尸进程清理者
    两种情况会产生僵尸进程：
    - 用户修改了 process_type
    - 用户修改了 process_name （后期需要去除掉 process_name）
    :return: processes which should be undead
    """

    release: 'Release'
    last_release: 'Release'

    def search(self) -> Tuple[List['Process'], List['Process']]:
        """
        :return: tuple, (type_processes, name_processes)
        """
        # 首次部署
        if not self.last_release or not self.last_release.build:
            return [], []

        procfile = self.release.get_procfile()
        last_procfile = self.last_release.get_procfile()
        zombie_type_processes = []
        zombie_name_processes = []

        logger.debug("latest version: %s, last version: %s", self.release.version, self.last_release.version)
        logger.debug("latest procfile: %s, last procfile: %s", procfile, last_procfile)
        for last_type, last_command in last_procfile.items():
            last_process = AppProcessManager(app=self.release.app).assemble_process(
                process_type=last_type, release=self.last_release
            )

            if last_process.name not in procfile:
                zombie_type_processes.append(last_process)
                continue

            this_process = AppProcessManager(app=self.release.app).assemble_process(
                process_type=last_type, release=self.release
            )
            if not get_command_name(this_process.runtime.proc_command) == get_command_name(
                last_process.runtime.proc_command
            ):
                zombie_name_processes.append(last_process)

        return zombie_type_processes, zombie_name_processes

    def kill(self, scheduler_client: 'K8sScheduler'):
        type_zombies, name_zombies = self.search()
        try:
            logger.info(f"going to clean process {type_zombies} for changing of process_type")
            scheduler_client.delete_processes(type_zombies)

            # 对于某些版本的资源映射（command_name free），command_name 的更改不再产生 zombie process
            if scheduler_client.mapper_version and not scheduler_client.mapper_version.ignore_command_name:
                logger.info(f"going to clean process {name_zombies} for changing of process_name")
                scheduler_client.delete_processes(name_zombies, with_access=False)

        except Exception as e:
            summary = f"deploy over, but clear {str(self.release.uuid)[:7]} which failed: {e}"
            logger.exception(summary)
            self.release.summary = summary
            self.release.save()
