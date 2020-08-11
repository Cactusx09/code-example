<template>
    <div>
        <div class="calculation-commissions-header columns">
            <div class="column is-1"><label class="label">{{ i18n('Komisiina polityka') }}</label></div>
            <div class="column is-2">
                <div class="commissions-button">
                    <span>{{ data.calculation_commission_name }}</span>
                    <span
                        class="icon is-small has-margin-left-medium has-text-info"
                        @click="showPolicy = true">
                        <fa icon="pen"></fa>
                    </span>
                </div>
            </div>
            <div class="column is-1"><label class="label">{{ i18n('Komisiina lohika') }}</label></div>
            <div class="column is-3">
                <a @click="testCalculationCommission()">
                    {{ data.commission_logic_name }}
                </a>
            </div>
        </div>

        <u-table
            v-if="data.commission_rows && data.commission_rows.length > 0"
            :template="calculationCommissionsTemplate"
            :table="commissionRows"
            class="has-margin-bottom-large"
        >
            <template #actions="{ row }">
                <button
                    class="button is-small is-table-button is-warning"
                    @click="editRow = { ...row }">
                    <span class="icon is-small"><fa icon="pen"/></span>
                </button>
            </template>
        </u-table>

        <div class="calculation-commissions-calculate">
            <div class="calculate-item columns">
                <div class="calculate-item-switch column is-6">
                    <label class="label">{{ i18n('Приховати комісії без контрагентів') }}</label>
                    <vue-switch
                        v-model="commissionAgentless"
                        @click="hideCommissionAgentless()"
                        class="has-margin-left-large is-medium is-info"
                    />
                </div>
                <div class="calculate-item-sum-commission column is-1 is-medium has-background-primary has-text-white">
                    <span>{{ i18n('Suma') }}: </span>
                    <span>{{ sumActualCommissionValues }}%</span></div>
                <div class="column is-4 has-text-right"><label class="label">{{ i18n('Maksymalnyi rozmir komisiinoi vynahorody za dohovorom, hrn') }}</label></div>
                <div class="column is-1 tag is-medium"><span>{{ data.commission_max_amount }}</span></div>
            </div>
            <div class="calculate-item columns">
                <div class="column is-11 has-text-right"><label class="label">{{ i18n('Splacheno, hrn') }}</label></div>
                <div class="column is-1 tag is-medium"><span>{{ data.commission_payed_amount }}</span></div>
            </div>
            <div class="calculate-item columns">
                <div class="column is-11 has-text-right"><label class="label">{{ i18n('Zalyshok, hrn') }}</label></div>
                <div class="column is-1 tag is-medium"><span>{{ data.commission_remained_amount }}</span></div>
            </div>
        </div>

        <policy-calculation-commissions
            v-if="showPolicy"
            :calculation-id="calculationId"
            @close="showPolicy = false"
            @save="$emit('fetch')"
        />

        <modal
            v-if="!!editRow"
            show
            @close="editRow = null">
            <div class="box">
                <h5 class="subtitle is-5">
                    <div class="columns">
                        <div class="column">
                            <h3 class="title is-5">{{ editRow.agent_displayname }}</h3>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column is-4">
                            <label class="label">{{ i18n('Faktychna komisiia, hrn') }}</label>
                            <u-input v-model="editRow.actual_commission_reward"/>
                        </div>
                        <div class="column is-4">
                            <label class="label">{{ i18n('Oplata') }}</label>

                            <vue-select
                                v-model="editRow.payment_status"
                                :i18n="i18n"
                            />
                        </div>
                    </div>
                </h5>
                <hr>
                <div class="level-right">
                    <button
                        class="button is-danger"
                        @click="editRow = null">
                        {{ i18n('Cancel') }}
                    </button>
                    <button
                        class="button is-success has-margin-left-medium"
                        @click="updateCalculationCommissions()">
                        {{ i18n('Save') }}
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>


import UTable from '@components/UTable'
import UInput from '@components/UInput'
import { Modal } from '@enso-ui/bulma'
import { VueSelect } from '@enso-ui/select/bulma'
import VueSwitch from '@enso-ui/switch/bulma'

import PolicyCalculationCommissions from '../modals/PolicyCalculationCommissionsModal'

import calculationCommissions from './CalculationCommissions'

export default {
    components: {
        UTable,
        UInput,
        Modal,
        VueSelect,
        VueSwitch,
        PolicyCalculationCommissions,
    },

    inject: ['i18n'],

    mixins: [calculationCommissions],

    props: {
        calculationId: {
            require: true,
        },
        data: {
            default: null,
        },
    },

    data() {
        return {
            showPolicy: false,
            edit: false,
            editRow: null,
            commissionAgentless: true,
        }
    },

    computed: {
        commissionRows() {
            return this.commissionAgentless
                ? this.data.commission_rows.filter(row => row.agent_displayname && row.agent_displayname !== '-')
                : this.data.commission_rows;
        },
        sumActualCommissionValues() {
            return this.commissionRows.reduce((result, row) => (result += Number(row.actual_commission_value) || 0), 0);
        },
    },

    methods: {
        hideCommissionAgentless() {
            this.commissionAgentless = !this.commissionAgentless;
        },

        updateCalculationCommissions() {
            const row = this.editRow;

            axios.post(route('inwork.contracts.updateCommissionRow'), {
                    row_id: row.row_id,
                    actual_commission_reward: row.actual_commission_reward,
                })
                .then(({ data }) => {
                    this.editRow = null;
                    this.fetchExtendedCalculationData();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        testCalculationCommission() {
            axios.get(route('inwork.contracts.testCalculationCommission'), {
                    params: {
                        calculation_id: this.calculationId,
                    }
                })
                .then(({ data }) => {
                    const routeData = this.$router.resolve({
                        name: 'administration.insuranceLogics.edit',
                        query: {
                            insurance_reference: data.insurance_reference,
                            ...data.locals,
                        },
                        params: {
                            insuranceLogic: data.insurance_logic_id,
                        },
                    });

                    window.open(routeData.href, '_blank');
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>

<style lang="sass">
.calculate-item
    &-switch
        display: flex
        align-items: center
        .label
            margin-bottom: 0
    &-sum-commission
        display: flex
        justify-content: space-between
        border: 1px solid #ddd
        border-top: 0
</style>
