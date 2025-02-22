<template>
  <section v-show="!isDataLoading">
    <div class="ps-action-header mb20 mt5">
      <div :class="['icon-wrapper', { 'active': appMarketConfig.enabled }]">
        <span :class="['paasng-icon', { 'paasng-lock': !appMarketConfig.enabled, 'paasng-unlock': appMarketConfig.enabled }]" />
      </div>
      <div class="title">
        <strong class="mr10">{{ appMarketConfig.enabled ? $t('已发布到应用市场') : $t('未发布到应用市场') }}</strong>
        <bk-switcher
          v-model="appMarketConfig.enabled"
          :disabled="isDisabled"
          @change="handlerSwitch"
        />
      </div>
      <p class="tip">
        {{ $t('发布到应用市场后，用户将可以通过蓝鲸应用市场搜索访问你的应用') }}
      </p>
    </div>
    <template v-if="!appPreparations.all_conditions_matched">
      <div :class="['ps-tip-block', 'is-danger']">
        <p class="title mb10">
          {{ $t('无法发布到应用市场') }}
        </p>
        <section class="content">
          <p
            v-for="(condition, index) of appPreparations.failed_conditions"
            :key="index"
          >
            <span>{{ $t(condition.message) }}</span>
            <a
              href="javascript: void(0);"
              class="ml10"
              @click="handleEditCondition(condition)"
            >
              {{ condition.action_name === 'deploy_prod_env' ? $t('去部署生产环境') : $t('去编辑') }}
            </a>
          </p>
        </section>
      </div>
    </template>
    <template v-else-if="confirmRequiredWhenPublish && !appMarketConfig.enabled && !isSureRisk">
      <div :class="['ps-tip-block', 'is-danger']">
        <p class="title mb10">
          {{ $t('无法发布到应用市场') }}
        </p>
        <section class="content">
          <p class="mb10">
            {{ $t('当前应用主模块创建时未使用蓝鲸开发框架初始化') }}
            <a
              href="javascript: void(0);"
              class="view-risk"
              @click="viewRisk"
            > {{ $t('查看风险') }} </a>
          </p>
        </section>
      </div>
    </template>
    <template v-else-if="appMarketConfig.enabled">
      <div :class="['ps-tip-block', 'is-success']">
        <section class="content">
          <p>
            {{ $t('应用已成功发布到蓝鲸应用市场') }}
            <section
              v-if="marketAddress"
              class="visit-link"
              @click="visitAppMarket"
            >
              {{ $t('立即访问') }}
            </section>
          </p>
        </section>
      </div>
    </template>

    <span class="ps-span" />

    <template v-if="engineAbled">
      <bk-form
        v-if="!confirmRequiredWhenPublish || isSureRisk || appMarketConfig.enabled"
        ref="visitInfoForm"
        :key="appMarketConfig.source_url_type"
        :label-width="130"
        :class="['pt10 pb10']"
        style="position: relative; margin-top: -10px;"
        :model="appMarketConfig"
      >
        <bk-form-item
          :label="$t('访问地址类型：')"
        >
          <bk-radio-group v-model="avaliableAddressValue">
            <template v-for="(item, index) in avaliableAddress">
              <div
                :key="index"
                class="moudle-url"
              >
                <bk-radio
                  :key="index"
                  :class="{ 'reset-mt': index !== 0 }"
                  :value="item.value"
                  :disabled="!appPreparations.all_conditions_matched"
                  style="line-height: 32px;"
                >
                  <!-- <span v-if="item.type !== 2" class="addressDetail">{{item.address}}</span> -->
                  <span>{{ typeMap[item.type] }}</span>
                </bk-radio>
                <p
                  v-if="item.address"
                  class="url"
                >
                  {{ item.address }}
                </p>
              </div>
            </template>
          </bk-radio-group>
        </bk-form-item>
        <bk-button
          v-if="avaliableAddress.length > 1"
          style="margin: 20px 0 0 130px;"
          theme="primary"
          :disabled="isSwitchDisabled"
          @click="openSwitchDialog"
        >
          {{ $t('更改访问地址') }}
        </bk-button>
      </bk-form>
    </template>
    <template v-else>
      <bk-form
        ref="visitInfoForm"
        :key="appMarketConfig.source_url_type"
        :label-width="130"
        :class="['pt10 pb10', { 'flash': isVisitFormFocus }]"
        style="position: relative; margin-top: -10px;"
        :model="appMarketConfig"
      >
        <bk-form-item
          v-if="curAppInfo.web_config.engine_enabled"
          :label="$t('访问地址类型：')"
        >
          <bk-radio
            :value="3"
            style="margin-top: 7px;"
            checked
            disabled
          >
            {{ $t('第三方') }}
          </bk-radio>
        </bk-form-item>

        <bk-form-item
          v-if="appMarketConfig.source_url_type === 3"
          :label="$t('访问地址：')"
          :required="true"
          :property="'source_tp_url'"
          :rules="visitInfoRules.sourceUrl"
        >
          <bk-input
            ref="urlInput"
            v-model="appMarketConfig.source_tp_url"
            :placeholder="`${$t('请输入第三方地址，例如')}: http://example.com)`"
          />
          <p class="tip mt10">
            {{ $t('用户从桌面打开应用时的访问地址') }}
          </p>
        </bk-form-item>

        <bk-form-item>
          <bk-button
            v-show="!engineAbled"
            theme="primary"
            class="mr10 mt5"
            :title="$t('保存')"
            :loading="isConfigSaving"
            @click.stop.prevent="submitVisitInfo"
          >
            {{ $t('保存') }}
          </bk-button>
        </bk-form-item>
      </bk-form>
    </template>

    <bk-dialog
      v-model="viewRiskDialog.visiable"
      theme="primary"
      :mask-close="false"
      :header-position="'center'"
      :width="viewRiskDialog.width"
      :title="$t('确认风险')"
      @after-leave="afterDialogClose"
    >
      <div>
        <p style="margin-bottom: 10px;">
          {{ $t('为了提升开发效率和应用的安全性，蓝鲸开发框架为应用提供了一套完整的用户鉴权体系。') }}
        </p>
        <p style="margin-bottom: 10px;">
          {{ $t('由于当前应用主模块') }} <span style="font-weight: bold;">({{ curModuleId }})</span> {{ $t('没有使用蓝鲸开发框架进行初始化，我们无法确认应用是否已经正常接入用户认证与鉴权。') }}
        </p>
        <p> {{ $t('你仍然可以继续将应用上线到蓝鲸市场，不过你需要确保应用已经自行接入安全的鉴权体系。') }} </p>
        <p style="margin-top: 10px;">
          <bk-checkbox
            v-model="riskChecked"
            :true-value="true"
            :false-value="false"
          >
            {{ $t('我确认模块已经接入了安全的用户鉴权体系') }}
          </bk-checkbox>
        </p>
      </div>
      <div slot="footer">
        <bk-button
          theme="primary"
          :disabled="!riskChecked"
          @click="goOn"
        >
          {{ $t('继续') }}
        </bk-button>
        <bk-button
          style="margin-left: 6px;"
          @click="viewRiskDialog.visiable = false"
        >
          {{ $t('取消') }}
        </bk-button>
      </div>
    </bk-dialog>

    <bk-dialog
      v-model="switchAddressDialog.visiable"
      width="540"
      header-position="left"
      :title="$t('确认更改访问地址？')"
      :theme="'primary'"
      :mask-close="false"
      @after-leave="afterAddressDialogClose"
    >
      <div>
        <p>{{ $t('请确认将访问地址更改为：') + (currentAddress.type === 2 ? $t('与主模块生产环境一致') : currentAddress.address) }}</p>
      </div>
      <div slot="footer">
        <bk-button
          theme="primary"
          :loading="switchAddressDialog.loading"
          @click="sureSwitchAddress"
        >
          {{ $t('确定') }}
        </bk-button>
        <bk-button
          theme="default"
          @click="switchAddressDialog.visiable = false"
        >
          {{ $t('取消') }}
        </bk-button>
      </div>
    </bk-dialog>
  </section>
</template>

<script>
    import appBaseMixin from '@/mixins/app-base-mixin.js';
    import { bus } from '@/common/bus';

    export default {
        mixins: [appBaseMixin],
        data () {
            return {
                isDataLoading: true,
                isConfigSaving: false,
                isInfoSaving: false,
                active: 'visitInfo',
                engineAbled: false,
                isVisitFormFocus: false,
                appStatus: '',
                appMarketConfig: {
                    enabled: false,
                    source_module_id: '',
                    source_tp_url: '',
                    source_url_type: 2
                },
                appPreparations: {
                    all_conditions_matched: false,
                    failed_conditions: []
                },
                visitInfoRules: {
                    sourceUrl: [
                        {
                            required: true,
                            message: this.$t('请输入第三方地址'),
                            trigger: 'blur'
                        },
                        {
                            regex: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
                            message: this.$t('请输入正确的URL地址'),
                            trigger: 'blur'
                        }
                    ]
                },
                viewRiskDialog: {
                    visiable: false,
                    width: 700
                },
                riskChecked: false,
                isSureRisk: false,
                typeMap: {
                    1: this.$t('未开启'),
                    2: this.$t('与主模块生产环境一致'),
                    3: this.$t('第三方'),
                    4: this.$t('主模块生产环境独立域名：'),
                    5: this.$t('与主模块生产环境一致，并启用 HTTPS')
                },
                avaliableAddress: [],
                avaliableAddressValue: 2,
                avaliableAddressValueBackup: null,
                switchAddressDialog: {
                    visiable: false,
                    loading: false
                },
                currentAddress: {},
                visitTabLoading: false,
                infoTabLoading: false,
                marketAddress: null
            };
        },
        computed: {
            // 是否设置第三方地址
            urlHasConfig () {
                return (this.appMarketConfig.source_url_type === 3) && this.appMarketConfig.source_tp_url;
            },

            // 是否无法发布到应用市场
            canUserMarket () {
                // 没有设置第三方
                // 应用下架
                // 应用没部署到正式环境
                // 应用信息不完整
                return this.urlHasConfig && this.appStatus !== 'reg' && this.appStatus !== 'deploy' && this.appStatus !== 'offlined';
            },
            isDisabled () {
                return !this.appPreparations.all_conditions_matched || (this.confirmRequiredWhenPublish && !this.isSureRisk && !this.appMarketConfig.enabled);
            },
            isSwitchDisabled () {
                return this.avaliableAddressValue === this.avaliableAddressValueBackup;
            },
            curAppInfo () {
                return this.$store.state.curAppInfo;
            }
        },
        inject: ['changeTab'],
        watch: {
            '$route' () {
                this.init();
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            /**
             * 初始化入口
             */
            async init () {
                this.initMarketConfig();
                this.checkAppPrepare();
                this.engineAbled = this.curAppInfo.web_config.engine_enabled;

                if (this.engineAbled) {
                    await this.fetchAvaliableAddress();
                }
            },

            visitAppMarket () {
                window.open(this.marketAddress);
            },

            async fetchAvaliableAddress () {
                try {
                    const res = await this.$store.dispatch('market/getAppMarketAvaliableAddress', this.appCode)
                    ;(res || []).forEach(item => {
                        if (item.type === 2 || item.type === 5) {
                            this.$set(item, 'value', item.type);
                        } else {
                            this.$set(item, 'value', item.address);
                        }
                    });
                    this.avaliableAddress = [...res];
                } catch (e) {
                    this.$paasMessage({
                        theme: 'error',
                        message: e.message
                    });
                }
            },

            openSwitchDialog () {
                this.switchAddressDialog.visiable = true;
                this.currentAddress = this.avaliableAddress.find(item => item.value === this.avaliableAddressValue);
            },

            afterAddressDialogClose () {
                this.currentAddress = {};
            },

            async sureSwitchAddress () {
                this.switchAddressDialog.loading = true;
                try {
                    await this.$store.dispatch('market/updateAppMarketAvaliableAddress', {
                        source_url_type: this.currentAddress.type,
                        source_tp_url: '',
                        custom_domain_url: this.currentAddress.type === 2 ? '' : this.currentAddress.address,
                        appCode: this.appCode
                    });
                    this.$paasMessage({
                        theme: 'success',
                        message: this.$t('访问地址更改成功')
                    });
                    this.avaliableAddressValueBackup = this.currentAddress.value;
                    this.switchAddressDialog.visiable = false;
                } catch (e) {
                    this.$paasMessage({
                        theme: 'error',
                        message: e.message
                    });
                } finally {
                    this.switchAddressDialog.loading = false;
                }
            },

            /**
             * 查看风险
             */
            viewRisk () {
                this.viewRiskDialog.visiable = true;
            },

            afterDialogClose () {
                this.riskChecked = false;
            },

            goOn () {
                this.isSureRisk = true;
                this.viewRiskDialog.visiable = false;
            },

            /**
             * 检查应用发布的准备条件
             */
            async checkAppPrepare () {
                try {
                    const res = await this.$store.dispatch('market/getAppMarketPrepare', this.appCode);
                    this.appPreparations = res;
                } catch (e) {
                    this.$paasMessage({
                        theme: 'error',
                        message: e.message
                    });
                }
            },

            /**
             * 完善发布条件
             * @param {Object} condition 条件对象
             */
            handleEditCondition (condition) {
                switch (condition.action_name) {
                    // 完善第三方地址
                    case 'fill_thirdparty_url':
                        this.$refs.urlInput.focus();
                        break;

                    // 未完善应用基本信息
                    case 'fill_product_info':
                        this.changeTab('baseInfo');
                        break;

                    // 应用未在生产环境成功部署
                    case 'deploy_prod_env':
                        this.$router.push({
                            name: 'appDeployForProd',
                            params: {
                                id: this.appCode
                            }
                        });
                        break;
                }
            },

            /**
             * 获取应用市场配置
             */
            async initMarketConfig () {
                this.isDataLoading = true;
                try {
                    const res = await this.$store.dispatch('market/getAppMarketConfig', this.appCode);
                    this.appMarketConfig = Object.assign(this.appMarketConfig, res);
                    if (this.appMarketConfig.source_url_type === 2) {
                        this.avaliableAddressValue = 2;
                    } else {
                        this.avaliableAddressValue = this.appMarketConfig.custom_domain_url;
                    }
                    this.avaliableAddressValueBackup = this.avaliableAddressValue;
                    this.marketAddress = this.appMarketConfig.market_address;
                } catch (e) {
                    this.$paasMessage({
                        theme: 'error',
                        message: e.message
                    });
                } finally {
                    this.isDataLoading = false;
                    this.$emit('data-ready', true);
                }
            },

            /**
             * 提交访问数据
             */
            submitVisitInfo () {
                this.$refs.visitInfoForm.validate().then(validator => {
                    this.updateAppMarketConfig();
                });
            },

            /**
             * 更新应用市场配置
             */
            async updateAppMarketConfig () {
                if (this.isConfigSaving) return;

                this.isConfigSaving = true;

                try {
                    await this.$store.dispatch('market/updateAppMarketConfig', {
                        appCode: this.appCode,
                        data: this.appMarketConfig
                    });

                    this.checkAppPrepare();

                    this.$paasMessage({
                        theme: 'success',
                        message: this.$t('保存成功！')
                    });
                } catch (e) {
                    this.$paasMessage({
                        theme: 'error',
                        message: e.message
                    });
                } finally {
                    this.isConfigSaving = false;
                }
            },

            /**
             * 处理开启或关闭市场
             */
            async handlerSwitch () {
                if (!this.appPreparations.all_conditions_matched) return;

                const status = this.appMarketConfig.enabled;
                try {
                    const res = await this.$store.dispatch('market/updateAppMarketSwitch', {
                        appCode: this.appCode,
                        data: {
                            enabled: status
                        }
                    });
                    this.appMarketConfig.enabled = status;
                    if (res.enabled) {
                        this.marketAddress = res.market_address;
                    }
                    bus.$emit('market_switch');
                    this.$store.commit('updateCurAppMarketPublished', res.enabled);
                } catch (e) {
                    this.$paasMessage({
                        theme: 'error',
                        message: e.message
                    });
                } finally {
                    if (status) {
                        this.isSureRisk = false;
                    }
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import 'index.scss';

    .moudle-url .url {
        padding: 8px 21px;
        font-size: 12px;
        color: #666;
        background-color: #FAFBFD;
    }
    .bk-form-control {
        margin-top: -5px;
    }
</style>
