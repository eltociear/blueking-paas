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
import pytest

from paas_wl.networking.ingress.constants import AppDomainSource
from paas_wl.networking.ingress.entities.ingress import ingress_kmodel
from paas_wl.networking.ingress.managers.domain import CustomDomainIngressMgr
from paas_wl.networking.ingress.models import AppDomain, AppDomainCert, AppDomainSharedCert

pytestmark = pytest.mark.django_db


@pytest.mark.auto_create_ns
class TestCustomDomainIngressWithHTTPS:
    @pytest.fixture
    def cert(self, app):
        return AppDomainCert.objects.create(
            region=app.region, name='cert-foo.com', cert_data='faked', key_data='faked'
        )

    @pytest.fixture
    def shared_cert(self, app):
        return AppDomainSharedCert.objects.create(
            region=app.region,
            name='cert-wildcard-foo.com',
            cert_data='faked',
            key_data='faked',
            auto_match_cns='*.foo.com;*.bar.com',
        )

    def test_domain_with_default_cert(self, app, cert):
        app_domain = AppDomain.objects.create(
            region=app.region,
            app=app,
            source=AppDomainSource.INDEPENDENT,
            host='foo.com',
            # Enable HTTPS
            https_enabled=True,
            cert=cert,
        )
        mgr = CustomDomainIngressMgr(app_domain)
        mgr.sync(default_service_name="foo-service")
        ingress = ingress_kmodel.get(app, mgr.ingress_name)
        assert ingress.domains[0].tls_enabled is True
        assert ingress.domains[0].tls_secret_name == 'eng-normal-cert-foo.com'

        # Disable https
        app_domain.https_enabled = False
        app_domain.save()
        mgr.sync()
        ingress = ingress_kmodel.get(app, mgr.ingress_name)
        assert ingress.domains[0].tls_enabled is False
        assert ingress.domains[0].tls_secret_name == ''

    def test_domain_with_shared_cert(self, app, shared_cert):
        app_domain = AppDomain.objects.create(
            region=app.region,
            app=app,
            source=AppDomainSource.INDEPENDENT,
            host='anything.foo.com',
            # Enable HTTPS
            https_enabled=True,
        )
        mgr = CustomDomainIngressMgr(app_domain)
        mgr.sync(default_service_name="foo-service")
        ingress = ingress_kmodel.get(app, mgr.ingress_name)
        assert ingress.domains[0].tls_enabled is True
        assert ingress.domains[0].tls_secret_name == 'eng-shared-cert-wildcard-foo.com'

    def test_domain_with_not_matched_shared_cert(self, app):
        app_domain = AppDomain.objects.create(
            region=app.region,
            app=app,
            source=AppDomainSource.INDEPENDENT,
            host='anything2foo.com',
            # Enable HTTPS
            https_enabled=True,
        )
        mgr = CustomDomainIngressMgr(app_domain)
        mgr.sync(default_service_name="foo-service")
        ingress = ingress_kmodel.get(app, mgr.ingress_name)
        assert ingress.domains[0].tls_enabled is False, "HTTPS domain with no certs should be turned off"

    def test_domain_with_no_https(self, app):
        app_domain = AppDomain.objects.create(
            region=app.region,
            app=app,
            source=AppDomainSource.INDEPENDENT,
            host='anything.foo.com',
            https_enabled=False,
        )
        mgr = CustomDomainIngressMgr(app_domain)
        mgr.sync(default_service_name="foo-service")
        ingress = ingress_kmodel.get(app, mgr.ingress_name)
        assert ingress.domains[0].tls_enabled is False
        assert ingress.domains[0].tls_secret_name == ''
