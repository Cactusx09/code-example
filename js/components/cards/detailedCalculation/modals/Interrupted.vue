<template>
    <modal-card :show="show"
        @close="$emit('close')"
        class="detailedCalcInterrupted__modal">
        <template #header>
            <div class="level">
                <div class="level-left">
                    <div class="title is-5">
                        {{ i18n('Dostrokove prypynennia') }}
                    </div>
                </div>

                <div class="level-right">
                    <a class="button is-link">
                        {{ i18n('Zavantazhyty shablon') }}
                        <span class="is-small has-margin-left-medium">
                            <fa icon="download"/>
                        </span>
                    </a>
                </div>
            </div>
        </template>

        <template #body>
            <div class="columns">
                <element-validation class="column is-12"
                    :name="'file'"
                    :errors="errors">
                    <uploader v-model="file"
                        ref="fileUploader"
                        api
                        @upload="
                            uploadFile();
                            errors.clear('file');
                        ">
                        <span>
                            {{ i18n('Dodaty zayavu') }}
                            <fa class="has-margin-left-medium"
                                icon="upload"/>
                        </span>
                    </uploader>
                </element-validation>
            </div>

            <div class="columns">
                <element-validation class="column"
                    :label="'Data dostrokovoho prypynennya'"
                    :name="'policy_interrupt_datetime'"
                    :errors="errors">
                    <datepicker v-model="data.policy_interrupt_datetime"
                        :is-danger="errors.has('policy_interrupt_datetime')"
                        :locale="$store.getters['preferences/lang']"
                        @input="errors.clear('policy_interrupt_datetime')"/>
                </element-validation>
            </div>

            <div class="columns">
                <element-validation class="column"
                    :name="'policy_interrupt_notes'"
                    :errors="errors">
                    <textarea v-model="data.policy_interrupt_notes"
                        :class="['textarea', { 'is-danger': errors.has('policy_interrupt_notes') }]"
                        @input="errors.clear('policy_interrupt_notes')"></textarea>
                </element-validation>
            </div>

            <div class="columns">
                <div class="column is-6">
                    <element-validation v-model="data.policy_balance_amount"
                        :label="'Залишок коштів'"
                        :name="'policy_balance_amount'"
                        :errors="errors"
                        type="number"/>
                </div>
            </div>

            <div class="columns">
                <div class="column field">
                    <label class="radio">
                        <input v-model="data.policy_balance_distribution_type"
                            :value="1"
                            type="radio"
                            name="policy_balance_distribution_type">
                        {{ i18n('Zarakhuvannya zalyshok koshtiv na kartkovyy rakhunok') }}
                    </label>
                </div>
            </div>

            <div class="columns">
                <div class="column field">
                    <label class="radio">
                        <input v-model="data.policy_balance_distribution_type"
                            :value="2"
                            type="radio"
                            name="policy_balance_distribution_type">
                        {{ i18n('Zarakhuvannya zalyshok koshtiv na dohovir') }}
                    </label>
                </div>
            </div>

            <div v-if="data.policy_balance_distribution_type === 2"
                class="columns">
                <div class="column is-12">
                    <u-table
                        :template="policyDistributedBalanceTemplate"
                        :table.sync="policyDistributedBalanceTable"
                        :scroll="5"
                        class="animated">
                    </u-table>
                </div>
            </div>
        </template>

        <template #footer>
            <button class="button is-danger is-small"
                @click="$emit('close')">
                {{ i18n('cancel') }}
            </button>

            <button class="button is-success"
                @click="save()">
                {{ i18n('save') }}
                <span class="is-small has-margin-left-medium">
                    <fa icon="save"/>
                </span>
            </button>
        </template>
    </modal-card>
</template>

<script>
import PolicyDistributedBalance from '@templates/detailedCalculationCard/PolicyDistributedBalance'

import { ModalCard } from '@enso-ui/modal/bulma'
import { Datepicker } from '@enso-ui/datepicker/bulma'
import Uploader from '@components/Uploader.vue'
import UTable from '@components/UTable.vue'

import ElementValidation from '@components/validations/ElementValidation.vue'
import Errors from '@enso-ui/forms/errors'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

library.add(faDownload)

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
        Datepicker,
        Uploader,
        UTable,
        ElementValidation,
    },

    mixins: [
        PolicyDistributedBalance,
        errorHandler,
    ],

    inject: ['i18n'],

    props: {
        calculationProductId: {
            type: [Number, String],
        },
    },

    data() {
        return {
            show: false,
            data: {
                policy_interrupt_datetime: null,
                policy_interrupt_notes: null,
                policy_balance_amount: null,
                policy_balance_distribution_type: null,
            },
            file: null,
            policyDistributedBalanceTable: [],
            errors: new Errors(),
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get('/api/inwork/contracts/fetchDetailedCalculationInterruptedForm', {
                    params: {
                        insurance_consultation_product_calculation_id: this.calculationProductId,
                    },
                })
                .then(({ data }) => {
                    Object.keys(this.data).forEach((name) => {
                        if (name === 'policy_balance_distribution_type') {
                            this.data[name] = data[name] || 1;
                            return;
                        }

                        this.data[name] = data[name];
                    });

                    this.show = true;

                    this.$nextTick(() => this.$refs.fileUploader.updateOptions(data.policy_client_statement));
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });

                    this.$emit('close');
                });
        },

        uploadFile() {
            let formData = this.file;
            formData.append('insurance_consultation_product_calculation_id', this.calculationProductId);

            axios.post('/api/inwork/contracts/uploadClientStatement', formData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$refs.fileUploader.updateOptions({
                        uploaded: true,
                        file_name: data.file_name,
                        url: data.url,
                        delete_url: data.delete_url,
                    });
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        save() {
            let formData = this.data;

            if (formData.policy_balance_distribution_type === 2) {
                formData = {
                    ...formData,
                    policyDistributedBalanceTable: this.policyDistributedBalanceTable,
                }
            }

            axios.post('/api/inwork/contracts/saveDetailedCalculationInterruptedForm', {
                    insurance_consultation_product_calculation_id: this.calculationProductId,
                    ...formData
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$emit('close');
                    this.$emit('save');
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
    }
}
</script>

<style lang="sass">
.detailedCalcInterrupted
    &__modal
        .level
            width: 100%
        .modal-card
            background-color: white
            border-radius: 6px
            box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
            color: #4a4a4a
            &-foot
                justify-content: flex-end
        .field
            &:not(:last-of-type)
                margin-bottom: 0
</style>
