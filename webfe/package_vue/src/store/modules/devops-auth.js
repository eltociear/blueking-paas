/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云 - PaaS 平台 (BlueKing - PaaS System) available.
* Copyright (C) 2017-2022THL A29 Limited, a Tencent company.  All rights reserved.
* Licensed under the MIT License (the "License").
* You may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on
* an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
* either express or implied. See the License for the
* specific language governing permissions and limitations under the License.
*
* We undertake not to change the open source license (MIT license) applicable
*
* to the current version of the project delivered to anyone in the future.
*/

/*
    蓝盾授权&代码检查
*/
import http from '@/api';
import { json2Query } from '@/common/tools';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    /**
         * 获取代码检查列表
         * @param {Object} params 请求参数：appCode, moduleId, env, limit, offset
         */
    getCodeReviewList ({ commit, state }, { appCode, moduleId, env, limit, offset }, config = {}) {
      const params = {
        limit,
        offset,
        env
      };
      const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/ci/jobs/?${json2Query(params)}`;
      return http.get(url, config);
    },

    /**
         * 判断token是否存在
         */
    getCiToken ({ commit, state }, config = {}) {
      const url = `${BACKEND_URL}/api/ci/token/?backend=tencent_ci`;
      return http.get(url, config);
    },

    /**
         * 获取授权url
         */
    getAuthUrl ({ commit, state }, config = {}) {
      const url = `${BACKEND_URL}/api/ci/oauth_url/?backend=tencent_ci`;
      return http.get(url, config);
    },

    getCiInfo ({ commit, state }, { appCode, moduleId }, config = {}) {
      const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/ci/info/`;
      return http.get(url, config);
    }
  }
};
