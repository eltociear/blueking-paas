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
from typing import List, Protocol, Tuple

from django.conf import settings
from elasticsearch import Elasticsearch
from elasticsearch_dsl.aggs import DateHistogram
from elasticsearch_dsl.response import AggResponse, Response
from elasticsearch_dsl.response.aggs import FieldBucketData

from paasng.pluginscenter.definitions import BKLogConfig, ElasticSearchHost, PluginBackendAPIResource, PluginLogConfig
from paasng.pluginscenter.thirdparty.log.search import SmartSearch
from paasng.pluginscenter.thirdparty.utils import make_client


class LogClientProtocol(Protocol):
    """LogClient protocol, all log search backend should abide this protocol"""

    def execute_search(self, index: str, search: SmartSearch, timeout: int) -> Tuple[Response, int]:
        """search log from index with search"""

    def aggregate_date_histogram(self, index: str, search: SmartSearch, timeout: int) -> FieldBucketData:
        """aggregate time-based histogram"""


class BKLogClient:
    """BKLogClient is an implement of LogClientProtocol, the log search backend is bk log search"""

    def __init__(self, config: BKLogConfig, bk_username: str):
        self.config = config
        self.client = make_client(
            PluginBackendAPIResource(apiName="log-search", path="esquery_dsl/", method="POST"), bk_username=bk_username
        )

    def execute_search(self, index: str, search: SmartSearch, timeout: int) -> Tuple[Response, int]:
        """search log from index with body and params, implement with bk-log"""
        data = {
            "indices": index,
            "scenario_id": self.config.scenarioID,
            "body": search.to_dict(),
        }
        resp = self._call_api(data, timeout)
        return Response(search.search, resp["data"]), resp["data"]["hits"]["total"]

    def aggregate_date_histogram(self, index: str, search: SmartSearch, timeout: int) -> FieldBucketData:
        """aggregate time-based histogram"""
        agg = DateHistogram(
            field=search.time_field,
            interval=search.time_range.detect_date_histogram_interval(),
            time_zone=settings.TIME_ZONE,
            min_doc_count=1,
        )
        search.search.aggs.bucket('histogram', agg)
        search.limit_offset(0, 0)
        data = {
            "indices": index,
            "scenario_id": self.config.scenarioID,
            "body": search.to_dict(),
        }
        resp = self._call_api(data, timeout)

        return AggResponse(search.search.aggs, search.search, resp["data"]["aggregations"]).histogram

    def _call_api(self, data, timeout: int):
        if self.config.bkdataAuthenticationMethod:
            data["bkdata_authentication_method"] = self.config.bkdataAuthenticationMethod
        if self.config.bkdataDataToken:
            data["bkdata_data_token"] = self.config.bkdataDataToken
        return self.client.call(data=data, timeout=timeout)


class ESLogClient:
    """ESLogClient is an implement of LogClientProtocol, the log search backend is official elasticsearch"""

    def __init__(self, hosts: List[ElasticSearchHost]):
        self.hosts = hosts
        self._client = Elasticsearch(hosts=[host.dict() for host in hosts])

    def execute_search(self, index: str, search: SmartSearch, timeout: int) -> Tuple[Response, int]:
        """search log from index with body and params, implement with es client"""
        response = Response(
            search.search,
            self._client.search(body=search.to_dict(), index=index, params={"request_timeout": timeout}),
        )
        return (response, self._get_response_count(index, search, timeout, response))

    def aggregate_date_histogram(self, index: str, search: SmartSearch, timeout: int) -> FieldBucketData:
        """aggregate time-based histogram"""
        agg = DateHistogram(
            field=search.time_field,
            interval=search.time_range.detect_date_histogram_interval(),
            time_zone=settings.TIME_ZONE,
            min_doc_count=1,
        )
        search.search.aggs.bucket('histogram', agg)
        search.limit_offset(0, 0)
        return AggResponse(
            search.search.aggs,
            search.search,
            self._client.search(body=search.to_dict(), index=index, params={"request_timeout": timeout})[
                "aggregations"
            ],
        ).histogram

    def _get_response_count(self, index: str, search: SmartSearch, timeout: int, response: Response) -> int:
        """get total field from es response if it had, or send a count response to es"""
        if response.hits.total.relation == "eq":
            return response.hits.total.value
        return self._client.count(body=search.to_dict(count=True), index=index, params={"request_timeout": timeout})[
            "count"
        ]


def instantiate_log_client(log_config: PluginLogConfig, bk_username: str) -> LogClientProtocol:
    """实例化 log client 实例"""
    if log_config.backendType == "bkLog":
        assert log_config.bkLogConfig
        return BKLogClient(log_config.bkLogConfig, bk_username=bk_username)
    elif log_config.backendType == "es":
        assert log_config.elasticSearchHosts
        return ESLogClient(log_config.elasticSearchHosts)
    raise NotImplementedError(f"unsupported backend_type<{log_config.backendType}>")
