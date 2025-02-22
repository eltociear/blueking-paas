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
    日志查询相关数据
*/
import http from '@/api';
import bartOptions from '@/json/bar_chart_default';
// store
const state = {
  chartData: bartOptions,
  filterData: [],
  logList: [],
  accessLogList: [],
  streamLogList: [],
  envList: [],
  processList: [],
  streamList: [],
  fieldList: []
};

// getters
const getters = {
  chartData: state => state.chartData
};

// mutations
const mutations = {
  updateChartData (state, data) {
    const chartOptions = JSON.parse(JSON.stringify(bartOptions));
    chartOptions.series = [{
      type: 'bar',
      data: data.series
    }];
    const timeline = data.timeline.map(item => {
      return item.substring(5);
    });
    chartOptions.xAxis.data = timeline;
    chartOptions.tooltip = {
      trigger: 'item',
      showDelay: 0,
      hideDelay: 50,
      transitionDuration: 0,
      borderRadius: 2,
      borderWidth: 1,
      padding: 5,
      formatter: function (params, ticket, callback) {
        return `${params.value}次<br/>${params.name}`;
      }
    };
    state.chartData = chartOptions;
  },

  clearData (state, data) {
    state.envList = [];
    state.streamList = [];
    state.processList = [];
  },

  updateFilterData (state, data) {
    const filters = [];
    const fieldList = [];
    data.forEach(item => {
      const condition = {
        id: item.key,
        name: item.name,
        text: item.chinese_name || item.name,
        list: []
      };
      item.options.forEach(option => {
        condition.list.push({
          id: option[0],
          text: option[0]
        });
      });
      if (condition.id === 'environment') {
        state.envList = condition.list;
      } else if (condition.id === 'process_id') {
        state.processList = condition.list;
      } else if (condition.id === 'stream') {
        state.streamList = condition.list;
      } else {
        fieldList.push(condition);
      }
      filters.push(condition);
    });
    state.filterData = filters;
    state.fieldList = fieldList;
  },

  updateLogList (state, data) {
    if (!data.hasOwnProperty('isToggled')) {
      data.isToggled = false;
    }
    state.logList = data;
  },

  updateAccessLogList (state, data) {
    if (!data.hasOwnProperty('isToggled')) {
      data.isToggled = false;
    }
    state.accessLogList = data;
  }
};

// actions
function queryStringify (params) {
  const queryParams = [];
  for (const key in params) {
    if (params[key]) {
      queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
    }
  }
  const queryString = queryParams.join('&');
  return queryString;
}
const actions = {
  getChartData ({ commit, state }, { appCode, moduleId, params, filter }) {
    const queryString = queryStringify(params);
    const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/log/timechart/?${queryString}`;

    return http.post(url, filter).then(res => {
      commit('updateChartData', res.data);
      return res;
    });
  },

  getFilterData ({ commit, state }, { appCode, moduleId, params }) {
    const queryString = queryStringify(params);
    const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/log/filters/?${queryString}`;
    return http.get(url);
  },

  getLogList ({ commit, state }, { appCode, moduleId, params, page, pageSize, filter }) {
    const queryString = queryStringify(params);
    const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/log/structured/list/?page=${page}&page_size=${pageSize}&${queryString}`;
    return http.post(url, filter).then(res => {
      commit('updateLogList', res.data.logs);
      return res;
    });
  },

  getAccessLogList ({ commit, state }, { appCode, moduleId, params, page, pageSize, filter }) {
    const queryString = queryStringify(params);
    const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/log/ingress/list/?page=${page}&page_size=${pageSize}&${queryString}`;
    return http.post(url, filter).then(res => {
      commit('updateAccessLogList', res.data.logs);
      return res;
    });
  },

  getStreamLogList ({ commit, state }, { appCode, moduleId, params, scrollId, filter }) {
    const queryString = queryStringify(params);
    const url = `${BACKEND_URL}/api/bkapps/applications/${appCode}/modules/${moduleId}/log/standard_output/list/?${queryString}`;
    return http.post(url, filter);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
