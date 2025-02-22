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

import echarts from 'echarts';

export default {
  bind: (el, binding) => {
    setTimeout(() => {
      el.echartsInstance = echarts.init(el);

      if (binding.value) {
        el.echartsInstance.setOption(binding.value);
      }

      el.resizeEventHandler = function () {
        el.echartsInstance.resize();
      };

      if (window.attachEvent) {
        window.attachEvent('onresize', el.resizeEventHandler);
      } else {
        window.addEventListener('resize', el.resizeEventHandler, false);
      }
    }, 1300);
  },
  update: (el, binding) => {
    setTimeout(() => {
      el.echartsInstance.setOption(binding.value);
    }, 1300);
  },
  unbind: (el) => {
    setTimeout(() => {
      el.echartsInstance.dispose();
      const _this = el;
      if (window.attachEvent) {
        window.detachEvent('onresize', _this.resizeEventHandler);
      } else {
        window.removeEventListener('resize', _this.resizeEventHandler, false);
      }
    }, 1300);
  }
};
