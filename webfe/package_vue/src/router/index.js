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

import Vue from 'vue';
import Router from 'vue-router';

const frontPage = () => import(/* webpackChunkName: 'front-page' */'@/views/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const devCenterIndex = () => import(/* webpackChunkName: 'dev-center-index' */'@/views/dev-center/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const monitorIndex = () => import(/* webpackChunkName: 'monitor-index' */'@/views/dev-center/monitor').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const searchIndex = () => import(/* webpackChunkName: 'search' */'@/views/dev-center/search/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const createApp = () => import(/* webpackChunkName: 'create-app' */'@/views/dev-center/create-app/main').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const createAppSucc = () => import(/* webpackChunkName: 'create-app' */'@/views/dev-center/create-app/success').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const createGitAppSucc = () => import(/* webpackChunkName: 'create-app' */'@/views/dev-center/create-app/success-git').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const createSmartAppSucc = () => import(/* webpackChunkName: 'create-app' */'@/views/dev-center/create-app/success-smart').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const createSimpleAppSucc = () => import(/* webpackChunkName: 'create-app' */'@/views/dev-center/create-app/success-simple').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const createAppFail = () => import(/* webpackChunkName: 'create-app' */'@/views/dev-center/create-app/failure').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appMigration = () => import(/* webpackChunkName: 'migration' */'@/views/dev-center/migration').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appIndex = () => import(/* webpackChunkName: 'app-index' */'@/views/dev-center/app/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// App: summary
const appSummary = () => import(/* webpackChunkName: 'app-sumary' */'@/views/dev-center/app/summary').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appSummaryNotDeployed = () => import(/* webpackChunkName: 'app-sumary' */'@/views/dev-center/app/summary/not-deployed').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appDeployments = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/deployment/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const cloudAppDeployments = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/cloud-deployment/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const cloudAppDeploymentsForProcess = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/cloud-deployment/deploy-process').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const cloudAppDeploymentsForEnv = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/cloud-deployment/deploy-env').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const cloudAppDeploymentsForYaml = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/cloud-deployment/deploy-yaml').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const cloudAppDeploymentsForResource = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/cloud-deployment/deploy-resource').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const cloudAppDeploymentsForHook = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/cloud-deployment/deploy-hook').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appPackages = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/packages').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appDeploymentsForStag = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/deployment/deploy-stag').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appDeploymentsForProd = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/deployment/deploy-prod').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appDeploymentsForHistory = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/deployment/deploy-history').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appDeploymentsForConfig = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/deployment/deploy-config').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appProcesses = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/processes').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appStatus = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/app-status').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appEntryConfig = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/entry-config').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appEnvVars = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/env-vars').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appWebAnalysis = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/analysis/web').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appLogAnalysis = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/analysis/log').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appEventAnalysis = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/analysis/event').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appLog = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/log').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const monitorAlarm = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/monitor-alarm').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const codeReview = () => import(/* webpackChunkName: 'app-engine' */'@/views/dev-center/app/engine/code-review').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// App: market
const appMarket = () => import(/* webpackChunkName: 'app-market' */'@/views/dev-center/app/market').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});
const appMobileMarket = () => import(/* webpackChunkName: 'app-market' */'@/views/dev-center/app/market/mobile-market').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appCreateModule = () => import(/* webpackChunkName: 'app-create-module' */'@/views/dev-center/app/create-module').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// App: basic config
const appMembers = () => import(/* webpackChunkName: 'app-basic-config' */'@/views/dev-center/app/basic-config/members').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appCloudAPI = () => import(/* webpackChunkName: 'app-basic-config' */'@/views/dev-center/app/basic-config/cloud-api').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appVoucher = () => import(/* webpackChunkName: 'app-basic-config' */'@/views/dev-center/app/basic-config/voucher').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appAccessPortal = () => import(/* webpackChunkName: 'app-basic-config' */'@/views/dev-center/app/basic-config/access-portal').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appBasicInfo = () => import(/* webpackChunkName: 'app-basic-config' */'@/views/dev-center/app/basic-config/info').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});
const moduleManage = () => import(/* webpackChunkName: 'app-basic-config' */'@/views/dev-center/app/basic-config/module-manage').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// App: Services
const appServicesByCategory = () => import(/* webpackChunkName: 'app-services' */'@/views/dev-center/app/services/category').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appServicesInstance = () => import(/* webpackChunkName: 'app-services' */'@/views/dev-center/app/services/instance').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appServicesSharedInstance = () => import(/* webpackChunkName: 'app-services' */'@/views/dev-center/app/services/shared-instance').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appServicesConfig = () => import(/* webpackChunkName: 'app-services' */'@/views/dev-center/app/services/config').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// App: access control
const appAccessCtlByIP = () => import(/* webpackChunkName: 'app-access-ctl' */'@/views/dev-center/app/access-ctl/by-ip').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appAccessCtlByUser = () => import(/* webpackChunkName: 'app-access-ctl' */'@/views/dev-center/app/access-ctl/by-user').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appAccessCtlPathExempt = () => import(/* webpackChunkName: 'app-access-ctl' */'@/views/dev-center/app/access-ctl/path-exempt').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const appAccessCtlOrderAudit = () => import(/* webpackChunkName: 'app-access-ctl' */'@/views/dev-center/app/access-ctl/order-audit').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// Services:
const srvsBase = () => import(/* webpackChunkName: 'services' */'@/views/services/base').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// Services: dynamic
const srvIndex = () => import(/* webpackChunkName: 'services' */'@/views/services/index').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvOverview = () => import(/* webpackChunkName: 'services' */'@/views/services/overview').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvVCSMain = () => import(/* webpackChunkName: 'services' */'@/views/services/vcs').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvV3Services = () => import(/* webpackChunkName: 'services' */'@/views/services/v3-services').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// Services: static
const srvStaticMagicBox = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/magic-box').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticAppCI = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/ci').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticAPIGateway = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/api-gateway').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticLesscode = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/lesscode').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticSDKBlueapps = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/sdk-blueapps').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticAppEngine = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/app-engine').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticBamboo = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/bamboo').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticMarket = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/market').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const srvStaticFeaturedApps = () => import(/* webpackChunkName: 'services-info' */'@/views/services/static/featured-apps').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

const docuManagement = () => import(/* webpackChunkName: 'docu-management' */'@/views/dev-center/app/docu-management').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

// error pages
const notFound = () => import(/* webpackChunkName: 'not-found' */'@/views/error-pages/not-found').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});
const permission403 = () => import(/* webpackChunkName: 'permission403' */'@/views/error-pages/403').then(module => {
  return module;
}).catch(error => {
  window.showDeployTip(error);
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  // 页面刷新时回到顶部
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: frontPage
    },
    {
      path: '/developer-center/',
      name: 'index',
      component: frontPage
    },
    {
      path: '/developer-center/apps/',
      name: 'myApplications',
      component: devCenterIndex
    },
    {
      path: '/developer-center/apps/my-monitor',
      name: 'myMonitor',
      component: monitorIndex
    },
    {
      path: '/developer-center/apps/search',
      name: 'search',
      component: searchIndex
    },
    {
      path: '/developer-center/app/create',
      name: 'createApp',
      component: createApp
    },
    {
      path: '/developer-center/apps/:id/module/create',
      component: appCreateModule,
      name: 'appCreateModule'
    },
    {
      path: '/developer-center/apps/migration/',
      name: 'appLegacyMigration',
      component: appMigration
    },
    {
      path: '/developer-center/apps/:id/403',
      name: 'permission403',
      component: permission403
    },
    {
      path: '/developer-center/apps/',
      name: '应用概览',
      component: appIndex,
      meta: {
        capture403Error: true
      },
      children: [
        {
          path: ':id',
          redirect: {
            name: 'appSummary'
          }
        },
        {
          path: ':id/:moduleId/summary',
          component: appSummary,
          name: 'appSummary',
          meta: {
            capture403Error: false
          }
        },
        {
          path: ':id/summary',
          component: appSummary,
          name: 'appSummaryWithModule',
          meta: {
            capture403Error: false
          }
        },
        {
          path: ':id/summary_none',
          component: appSummaryNotDeployed,
          name: 'appSummaryEmpty'
        },
        {
          path: ':id/base-info',
          component: appBasicInfo,
          name: 'appBaseInfo',
          meta: {
            capture403Error: false
          }
        },
        {
          path: ':id/:moduleId/module-manage',
          component: moduleManage,
          name: 'moduleManage',
          meta: {
            capture403Error: false
          }
        },
        {
          path: ':id/module-manage',
          component: moduleManage,
          name: 'moduleManageWithModule',
          meta: {
            capture403Error: false
          }
        },
        {
          path: ':id/roles',
          component: appMembers,
          name: 'appRoles',
          meta: {
            capture403Error: false
          }
        },
        {
          path: ':id/:moduleId/deploy',
          component: appDeployments,
          name: 'appDeploy',
          redirect: {
            name: 'appDeployForStag'
          },
          children: [
            {
              path: 'stag',
              component: appDeploymentsForStag,
              name: 'appDeployForStag',
              meta: {
                module: 'stag'
              }
            },
            {
              path: 'prod',
              component: appDeploymentsForProd,
              name: 'appDeployForProd',
              meta: {
                module: 'prod'
              }
            },
            {
              path: 'history',
              component: appDeploymentsForHistory,
              name: 'appDeployForHistory',
              meta: {
                module: 'history'
              }
            },
            {
              path: 'config',
              component: appDeploymentsForConfig,
              name: 'appDeployForConfig',
              meta: {
                module: 'config'
              }
            }
          ]
        },
        {
          path: ':id/:moduleId/cloud-deploy',
          component: cloudAppDeployments,
          name: 'cloudAppDeploy',
          redirect: {
            name: 'cloudAppDeployForProcess'
          },
          children: [
            {
              path: 'process',
              component: cloudAppDeploymentsForProcess,
              name: 'cloudAppDeployForProcess',
              meta: {
                module: 'process'
              }
            },
            {
              path: 'env',
              component: cloudAppDeploymentsForEnv,
              name: 'cloudAppDeployForEnv',
              meta: {
                module: 'env'
              }
            },
            {
              path: 'yaml',
              component: cloudAppDeploymentsForYaml,
              name: 'cloudAppDeployForYaml',
              meta: {
                module: 'yaml'
              }
            },
            {
              path: 'hook',
              component: cloudAppDeploymentsForHook,
              name: 'cloudAppDeployForHook',
              meta: {
                module: 'hook'
              }
            },
            {
              path: 'resource',
              component: cloudAppDeploymentsForResource,
              name: 'cloudAppDeployForResource',
              meta: {
                module: 'resource'
              }
            }
          ]
        },
        {
          path: ':id/deploy',
          component: appDeployments,
          name: 'appDeployWithModule'
        },
        {
          path: ':id/:moduleId/package',
          component: appPackages,
          name: 'appPackages'
        },
        {
          path: ':id/:moduleId/process',
          component: appProcesses,
          name: 'appProcess'
        },
        {
          path: ':id/:moduleId/status',
          component: appStatus,
          name: 'appStatus'
        },
        {
          path: ':id/process',
          component: appProcesses,
          name: 'appProcessWithModule'
        },
        {
          path: ':id/cloudapi',
          component: appCloudAPI,
          name: 'appCloudAPI'
        },
        {
          path: ':id/ticket',
          component: appVoucher,
          name: 'appVoucher'
        },
        {
          path: ':id/access-portal',
          component: appAccessPortal,
          name: 'appAccessPortal'
        },
        {
          path: ':id/market',
          component: appMarket,
          name: 'appMarket'
        },
        {
          path: ':id/mobile-market',
          component: appMobileMarket,
          name: 'appMobileMarket'
        },
        {
          path: ':id/:moduleId/app_entry_config',
          component: appEntryConfig,
          name: 'appEntryConfig'
        },
        {
          path: ':id/app_entry_config',
          component: appEntryConfig,
          name: 'appEntryConfigWithModule'
        },
        {
          path: ':id/:moduleId/log',
          component: appLog,
          name: 'appLog'
        },
        {
          path: ':id/log',
          component: appLog,
          name: 'appLogWithModule'
        },
        {
          path: ':id/:moduleId/monitor-alarm',
          component: monitorAlarm,
          name: 'monitorAlarm'
        },
        {
          path: ':id/monitor-alarm',
          component: monitorAlarm,
          name: 'monitorAlarmWithModule'
        },
        {
          path: ':id/:moduleId/web-analysis',
          component: appWebAnalysis,
          name: 'appWebAnalysis'
        },
        {
          path: ':id/web-analysis',
          component: appWebAnalysis,
          name: 'appWebAnalysisWithModule'
        },
        {
          path: ':id/:moduleId/log-analysis',
          component: appLogAnalysis,
          name: 'appLogAnalysis'
        },
        {
          path: ':id/log-analysis',
          component: appLogAnalysis,
          name: 'appLogAnalysisWithModule'
        },
        {
          path: ':id/:moduleId/event-analysis',
          component: appEventAnalysis,
          name: 'appEventAnalysis'
        },
        {
          path: ':id/event-analysis',
          component: appEventAnalysis,
          name: 'appEventAnalysisWithModule'
        },
        {
          path: ':id/:moduleId/code-review',
          component: codeReview,
          name: 'codeReview'
        },
        {
          path: ':id/code-review',
          component: codeReview,
          name: 'codeReviewWithModule'
        },
        {
          path: ':id/:moduleId/environment_variable',
          component: appEnvVars,
          name: 'appEnvVariables'
        },
        {
          path: ':id/environment_variable',
          component: appEnvVars,
          name: 'appEnvVariablesWithModule'
        },
        {
          path: ':id/none',
          name: 'none-app',
          component: notFound
        },
        {
          path: ':id/:moduleId/service/:category_id',
          component: appServicesByCategory,
          name: 'appService'
        },
        {
          path: ':id/service/:category_id',
          component: appServicesByCategory,
          name: 'appServiceWithModule'
        },
        {
          path: ':id/:moduleId/service/:category_id/service_inner/:service',
          component: appServicesInstance,
          name: 'appServiceInner'
        },
        {
          path: ':id/service/:category_id/service_inner/:service',
          component: appServicesInstance,
          name: 'appServiceInnerWithModule'
        },
        {
          path: ':id/:moduleId/service/:category_id/service_inner_shared/:service',
          component: appServicesSharedInstance,
          name: 'appServiceInnerShared'
        },
        {
          path: ':id/service/:category_id/service_inner_shared/:service',
          component: appServicesSharedInstance,
          name: 'appServiceInnerShared'
        },
        {
          path: ':id/:moduleId/service/:category_id/service_config/:service',
          component: appServicesConfig,
          name: 'appServiceConfig'
        },
        {
          path: ':id/permission/user',
          component: appAccessCtlByUser,
          name: 'appPermissionUser'
        },
        {
          path: ':id/permission/path-exempt',
          component: appAccessCtlPathExempt,
          name: 'appPermissionPathExempt'
        },
        {
          path: ':id/permission/ip',
          component: appAccessCtlByIP,
          name: 'appPermissionIP'
        },
        {
          path: ':id/permission/audit',
          component: appAccessCtlOrderAudit,
          name: 'appOrderAudit'
        },
        {
          path: ':id/docu-management',
          component: docuManagement,
          name: 'docuManagement'
        }
      ]
    },
    {
      path: '/developer-center/service/',
      component: srvsBase,
      children: [
        {
          path: '',
          component: srvIndex,
          name: 'serviceIndex'
        },
        {
          path: 'code',
          component: srvVCSMain,
          name: 'serviceCode'
        },
        {
          path: 'magicbox',
          component: srvStaticMagicBox,
          name: 'serviceMagicBox'
        },
        {
          path: 'ci',
          component: srvStaticAppCI,
          name: 'serviceCi'
        },
        {
          path: 'apigateway',
          component: srvStaticAPIGateway,
          name: 'serviceAPIGateway'
        },
        {
          path: 'lesscode',
          component: srvStaticLesscode,
          name: 'serviceLesscode'
        },
        {
          path: 'framework',
          component: srvStaticSDKBlueapps,
          name: 'serviceFramework'
        },
        {
          path: 'vas/:category_id/service_inner/:name',
          component: srvOverview,
          name: 'serviceInnerPage'
        },
        {
          path: 'app-engine',
          component: srvStaticAppEngine,
          name: 'serviceAppEngine'
        },
        {
          path: 'vas/:category_id',
          component: srvV3Services,
          name: 'serviceVas'
        },
        {
          path: 'bamboo',
          component: srvStaticBamboo,
          name: 'serviceBamboo'
        },
        {
          path: 'market',
          component: srvStaticMarket,
          name: 'serviceMarket'
        },
        {
          path: 'recommend',
          component: srvStaticFeaturedApps,
          name: 'serviceRecommend'
        }
      ]
    },
    {
      path: '/developer-center/apps/:id/create/success',
      name: 'createSimpleAppSucc',
      component: createSimpleAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/smart/success',
      name: 'createSmartAppSucc',
      component: createSmartAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/bk_svn/success',
      name: 'createAppSucc',
      component: createAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/bare_svn/success',
      name: 'createCustomSvnAppSucc',
      component: createAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/bk_gitlab/success',
      name: 'createGitLabAppSucc',
      component: createGitAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/tc_git/success',
      name: 'createTCGitAppSucc',
      component: createGitAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/bare_git/success',
      name: 'createCustomGitAppSucc',
      component: createGitAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/github/success',
      name: 'createGithubAppSucc',
      component: createGitAppSucc
    },
    {
      path: '/developer-center/apps/:id/create/gitee/success',
      name: 'createGithubAppSucc',
      component: createGitAppSucc
    },
    {
      path: '/developer-center/app/create/fail',
      name: 'createAppFail',
      component: createAppFail
    },
    {
      path: 'none',
      name: 'none',
      component: notFound
    },
    {
      path: '*',
      name: '404',
      component: notFound
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  sessionStorage.setItem('NOTICE', true);
  if (window.location.href.indexOf(window.GLOBAL_CONFIG.V3_OA_DOMAIN) !== -1) {
    const url = window.location.href.replace(window.GLOBAL_CONFIG.V3_OA_DOMAIN, window.GLOBAL_CONFIG.V3_WOA_DOMAIN);
    window.location.replace(url);
  } else {
    next();
  }
});

export default router;
