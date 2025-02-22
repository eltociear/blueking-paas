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
from typing import List, Type, Union

from blue_krill.monitoring.probe.base import Issue, VirtualProbe
from blue_krill.monitoring.probe.http import BKHttpProbe, HttpProbe
from blue_krill.monitoring.probe.mysql import MySQLProbe, transfer_django_db_settings
from blue_krill.monitoring.probe.redis import RedisProbe, RedisSentinelProbe
from django.conf import settings
from django.utils.module_loading import import_string
from django.utils.translation import gettext as _

from paasng.settings.utils import is_redis_sentinel_backend


def get_default_healthz_token():
    return settings.HEALTHZ_TOKEN


def get_default_probes():
    probe_modules = getattr(settings, 'HEALTHZ_PROBES')
    probes = []
    for probe_module in probe_modules:
        probes.append(import_string(probe_module))
    return probes


class BKConsoleProbe(MySQLProbe):
    name = "console"
    is_core = False

    def __init__(self):
        super().__init__()
        self.config = transfer_django_db_settings(getattr(settings, 'BK_CONSOLE_DBCONF'))


class PlatformMysqlProbe(MySQLProbe):
    name = "platform-mysql"
    config = transfer_django_db_settings(settings.DATABASES['default'])


class ESBProbe(BKHttpProbe):
    name = 'esb'
    url = settings.COMPONENT_SYSTEM_HEALTHZ_URL
    params = {"token": get_default_healthz_token()}


class APIGWProbe(BKHttpProbe):
    name = 'apigw'
    url = settings.APIGW_HEALTHZ_URL
    params = {"token": get_default_healthz_token()}
    is_core = False


class BKDocsProbe(HttpProbe):
    name = 'bkdocs'
    url = settings.BKDOC_URL
    is_core = False


class RGWProbe(HttpProbe):
    name = "rgw"
    url = settings.BLOBSTORE_S3_ENDPOINT


class ServiceHubProbe(VirtualProbe):
    name = "bk-services"
    is_core = False

    def diagnose(self) -> List[Issue]:
        from paasng.dev_resources.servicehub.remote.collector import (
            FetchRemoteSvcError,
            RemoteSvcConfig,
            RemoteSvcFetcher,
        )

        try:
            remote_svc_configs = settings.SERVICE_REMOTE_ENDPOINTS
        except AttributeError:
            return [
                Issue(
                    fatal=True,
                    description="Can't initialize remote services, SERVICE_REMOTE_ENDPOINTS is not configured",
                )
            ]

        issues = []
        for endpoint_conf in remote_svc_configs:
            config = RemoteSvcConfig.from_json(endpoint_conf)
            fetcher = RemoteSvcFetcher(config)
            try:
                fetcher.fetch()
            except FetchRemoteSvcError:
                issues.append(
                    Issue(
                        fatal=True,
                        description=_("远程增强服务「{config_name}」状态异常, 请检查服务可用性。").format(config_name=config.name),
                    )
                )
            except Exception:
                issues.append(
                    Issue(
                        fatal=True,
                        description=_("探测远程增强服务「{config_name}」时发生未知异常, 请检查配置情况。").format(config_name=config.name),
                    )
                )
        return issues


class _RedisProbe(RedisProbe):
    name = 'platform-redis'
    redis_url = settings.REDIS_URL


class _RedisSentinelProbe(RedisSentinelProbe):
    name = 'platform-redis'
    redis_url = settings.REDIS_URL
    master_name = settings.SENTINEL_MASTER_NAME
    sentinel_kwargs = {'password': settings.SENTINEL_PASSWORD}


def _get_redis_probe_cls() -> Union[Type[_RedisSentinelProbe], Type[_RedisProbe]]:
    if is_redis_sentinel_backend(settings.REDIS_URL):
        return _RedisSentinelProbe
    return _RedisProbe


PlatformRedisProbe = _get_redis_probe_cls()
