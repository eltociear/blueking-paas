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
    基础信息
 */

import Vue from 'vue';

// store
const state = {
  stagGatewayInfos: null,
  prodGatewayInfos: null
};

// getters
const getters = {

};

// mutations
const mutations = {};

// actions
const actions = {
  /**
     * 获取各环境网关获取情况
     *
     * @param {Function} commit store commit mutation handler
     * @param {Object} state store state
     * @param {String} appCode 应用code
     * @return {String} env 环境
     */
  getGatewayInfos ({ commit, state }, { appCode, env, moduleName }) {
    const url = `${BACKEND_URL}/svc_workloads/api/scheduling/applications/${appCode}/modules/${moduleName}/envs/${env}/egress_gateway_infos/default/`;

    return Vue.http.get(url).then(resp => {
      return resp;
    });
  },

  /**
     * 获取相应环境出口网关信息
     *
     * @param {Function} commit store commit mutation handler
     * @param {Object} state store state
     * @param {String} appCode 应用code
     * @return {String} env 环境
     */
  enableGatewayInfos ({ commit, state }, { appCode, env, moduleName }) {
    const url = `${BACKEND_URL}/svc_workloads/api/scheduling/applications/${appCode}/modules/${moduleName}/envs/${env}/egress_gateway_infos/`;

    return Vue.http.post(url).then(resp => {
      return resp;
    });
  },

  /**
     * 清除当前已获取的的出口网关信息
     *
     * @param {Function} commit store commit mutation handler
     * @param {Object} state store state
     * @param {String} appCode 应用code
     * @return {String} env 环境
     */
  clearGatewayInfos ({ commit, state }, { appCode, env, moduleName }) {
    const url = `${BACKEND_URL}/svc_workloads/api/scheduling/applications/${appCode}/modules/${moduleName}/envs/${env}/egress_gateway_infos/default/`;

    return Vue.http.delete(url).then(resp => {
      return resp;
    });
  },

  /**
     * 获取lessCode应用列表信息地址
     *
     * @param {Function} commit store commit mutation handler
     * @param {Object} state store state
     * @param {String} appCode 应用code
     * @return {String} env 环境
     */
  gitLessCodeAddress ({ commit, state }, { appCode, moduleName }) {
    const url = `${BACKEND_URL}/api/bkapps/lesscode/${appCode}/modules/${moduleName}/`;

    return Vue.http.get(url).then(resp => {
      return resp;
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
