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

/**
 * @file echarts 图表配置
 */
// import moment from 'moment'
import i18n from '@/language/i18n';
export default {
  pv_uv: {
    color: ['#699df4', '#ffb849'],
    // color: ['#4679f6', '#8ec68d', '#f2d0a8'],
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        animation: true,
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter (params, ticket, callback) {
        let ret = `<div>${params[0].axisValueLabel}</div>`;
        params.forEach(item => {
          let val = parseInt(item.value);
          if (val === '0.00') {
            val = 0;
          }
          ret += `<div>${item.seriesName}：${val}${i18n.t('次')}</div>`;
        });
        return ret;
      }
    },
    legend: {
      data: [
        'Current',
        'Request',
        'Limit'
      ]
    },
    toolbox: {
      show: false
    },
    grid: {
      top: '5%',
      left: '5%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      // 设置横轴
      axisLine: {
        show: true,
        lineStyle: {
          color: '#dde3ea'
        }
      },
      // 设置横轴坐标刻度
      axisTick: {
        show: false
      },
      // 设置横轴文字
      axisLabel: {
        color: '#8a8f99',
        formatter (value, index) {
          let ret = value;
          if (value) {
            ret = value.replace(' ', '\n');
          }
          return ret;
        }
      },
      // 设置风格 - 竖线
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ecf0f4'],
          type: 'dashed'
        }
      },
      data: []
    }],
    yAxis: [{
      boundaryGap: [0, '2%'],
      type: 'value',
      // 设置纵轴线条
      axisLine: {
        show: true,
        lineStyle: {
          color: '#dde3ea'
        }
      },
      // 设置纵轴刻度
      axisTick: {
        show: false
      },
      // 设置纵轴文字
      axisLabel: {
        color: '#8a8f99',
        formatter (value, index) {
          return `${value}`;
        }
      },
      // 设置网格 - 横线
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ecf0f4'],
          type: 'dashed'
        }
      }
    }],
    series: [
    ]
  }
};
