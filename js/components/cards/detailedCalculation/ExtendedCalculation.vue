<template>
    <div class="addition-info">
        <div class="addition-info-dropdown">
            <div
                class="dropdown-indicator has-text-info"
                @click="
                    !show
                        ? fetchExtendedCalculationData()
                        : show = false;
                ">
                <span>{{ i18n(!show ? 'Dodatkova informatsiya' : 'Skhovaty') }}</span>

                <dropdown-indicator :open="show"/>
            </div>
        </div>

        <div v-if="show">
            <div class="addition-info-title title is-5 has-background-light">
                <span class="icon has-margin-right-medium"><fa icon="info"></fa></span>
                {{ i18n('Dodatkova informatsiya') }}
                {{ i18n(detailedCalculation.product_subtype_name.value) }}
                {{ i18n(detailedCalculation.product_code.value) }}
                {{ i18n(detailedCalculation.product_name.value) }}
            </div>

            <div class="addition-info-block">
                <div class="addition-info-block-title box level">
                    <div class="level-left title is-6">
                        <span>{{ i18n('Strakhova lohika') }}</span>
                        <router-link
                            :to="{
                                name: 'administration.insuranceLogics.edit',
                                query: {
                                    insurance_reference: data.insuranceLogicData.insurance_reference,
                                    ...data.insuranceLogicData.locals,
                                },
                                params: {
                                    insuranceLogic: data.insuranceLogicData.insurance_logic_id,
                                },
                            }"
                            target="_blank"
                            class="has-margin-left-small">
                            {{ i18n(data.insuranceLogicData.insurance_logic_name) }}
                        </router-link>
                    </div>

                    <div class="level-right">
                        <div
                            class="dropdown-indicator has-text-info"
                            @click="controlInsuranceLogic.show = !controlInsuranceLogic.show">

                            <dropdown-indicator :open="controlInsuranceLogic.show" class="is-large fa-lg"/>
                        </div>
                    </div>
                </div>

                <div
                    v-if="controlInsuranceLogic.show"
                    class="addition-info-content logic-block columns">
                    <div class="column is-6">
                        <article
                            class="message is-info">
                            <div class="message-body">
                                <p>{{ data.insuranceLogicData.insurance_logic_formula }}</p>
                            </div>
                        </article>
                    </div>
                    <div class="column is-6">
                        <article
                            v-if="data.insuranceLogicData.status === 'success'"
                            class="message is-success">
                            <div class="message-body">
                                <p>{{ i18n('Vyrazhennya') }}: <strong class="info">{{ data.insuranceLogicData.frozenFormula }}</strong></p>
                                <p class="has-margin-top-medium">{{ i18n('Rezultat') }}: <strong class="success">{{ data.insuranceLogicData.result }}</strong></p>
                            </div>
                        </article>

                        <article
                            v-else-if="data.insuranceLogicData.status === 'error'"
                            class="message is-danger">
                            <div class="message-body">
                                {{ i18n(data.insuranceLogicData.message) }}
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            <div class="addition-info-block">
                <div class="addition-info-block-title box level">
                    <div class="level-left">
                        <h3 class="title is-6">{{ i18n('Rozrakhunok komisii') }}</h3>
                    </div>

                    <div class="level-right">
                        <div
                            class="dropdown-indicator has-text-info"
                            @click="controlCalculationCommissions.show = !controlCalculationCommissions.show">

                            <dropdown-indicator :open="controlCalculationCommissions.show" class="is-large fa-lg"/>
                        </div>
                    </div>
                </div>

                <commissions
                    v-if="controlCalculationCommissions.show"
                    :data="data.calculationCommissionsData"
                    :calculation-id="calculationId"
                    class="addition-info-content"
                    @fetch="fetchExtendedCalculationData()"
                />
            </div>

            <div
                v-if="!!data.relatedCalculationsData && data.relatedCalculationsData.length > 0"
                class="addition-info-block">
                <div class="addition-info-block-title box level">

                    <div class="level-left">
                        <h3   h3 class="title is-6">{{ i18n('Povyazani polisy') }}</h3>
                    </div>

                    <div class="level-right">
                        <div
                            class="dropdown-indicator has-text-info"
                            @click="controlRelatedCalculations.show = !controlRelatedCalculations.show">

                            <dropdown-indicator :open="controlRelatedCalculations.show" class="is-large fa-lg"/>
                        </div>
                    </div>
                </div>

                <u-table
                    v-if="controlRelatedCalculations.show"
                    :template.sync="relatedCalculationsTemplate"
                    :table.sync="data.relatedCalculationsData"
                    :scroll="100"
                    class="addition-info-content">
                    <template #calculation_code="{ row }">
                        <div v-if="row.is_old_contract"
                            class="has-margin-bottom-medium">
                            <div class="label has-text-weight-bold has-text-info">{{ i18n('Stara systema') }}</div>
                            <a
                                :href="row.calculation_link"
                                class="tag is-normal is-info"
                                target="_blank">
                                {{ i18n(row.calculation_code) }}
                            </a>
                        </div>

                        <router-link
                            v-else
                            :to="row.calculation_link"
                            target="_blank">
                            {{ i18n(row.calculation_code) }}
                        </router-link>
                    </template>
                </u-table>
            </div>

            <div
                v-if="!!data.multiyearTableData && data.multiyearTableData.length > 0"
                class="addition-info-block table-calendar">
                <div class="addition-info-block-title box level">
                    <div class="level-left">
                        <h3 class="title is-6">{{ i18n('Bahatorichnyi kalendar') }}</h3>
                    </div>

                    <div class="level-right">
                        <div
                            class="dropdown-indicator has-text-info"
                            @click="controlMultiyear.show = !controlMultiyear.show">

                            <dropdown-indicator :open="controlMultiyear.show" class="is-large fa-lg"/>
                        </div>
                    </div>
                </div>

                <div v-if="controlMultiyear.show"
                    class="addition-info-content">
                    <div class="level-right has-margin-bottom-large">
                        <button
                            class="button is-info is-small"
                            @click="controlMultiyear.showRegenerate = true">
                            {{ i18n('Pereformuvaty') }}
                        </button>
                    </div>

                    <u-table
                        :template.sync="multiyearTableTemplate"
                        :table.sync="data.multiyearTableData"
                        :scroll="100"
                        class="addition-info-content">
                        <template #policy_begin_datetime="{ row }">
                            {{ row.policy_begin_datetime | formatDate() }}
                        </template>

                        <template #actions="{ row }">
                            <span class="icon is-medium"
                                @click="controlMultiyear.insuranceLogic = {
                                    product_name: row.product_name,
                                    formula: row.formula,
                                }">
                                <fa class="fa-lg" icon="eye"/>
                            </span>
                            <span class="icon is-medium"
                                @click="controlMultiyear.editRow = { ...row }">
                                <fa class="fa-lg" icon="pen"/>
                            </span>
                        </template>
                    </u-table>
                </div>

                <fade>
                    <div
                        v-if="!!controlMultiyear.insuranceLogic"
                        class="table-hello-board box raises-on-hover">
                        <div class="level">
                            <p class="title is-5 is-marginless">{{ i18n(controlMultiyear.insuranceLogic.product_name) }}</p>
                            <button
                                class="delete"
                                @click="controlMultiyear.insuranceLogic = null">
                            </button>
                        </div>
                        <div class="message is-success">
                            <div class="message-body">
                                <p>{{ i18n('Vyrazhennya') }}: <strong class="info">{{ controlMultiyear.insuranceLogic.formula }}</strong></p>
                            </div>
                        </div>
                    </div>
                </fade>

                <modal
                    v-if="!!controlMultiyear.editRow"
                    show
                    @close="controlMultiyear.editRow = null">
                    <div class="box">
                        <h5 class="subtitle is-5">
                            <div class="columns">
                                <div class="column is-4">
                                    <label class="label">{{ i18n('Zahalna strakhova suma, uah') }}</label>
                                    <u-input v-model="controlMultiyear.editRow.total_insurance_price"/>
                                </div>
                                <div class="column is-4">
                                    <label class="label">{{ i18n('Taryf, %') }}</label>
                                    <u-input v-model="controlMultiyear.editRow.total_reward"/>
                                </div>
                                <div class="column is-4">
                                    <label class="label">{{ i18n('Strakhova premiya, uah') }}</label>
                                    <u-input v-model="controlMultiyear.editRow.insurance_rate"/>
                                </div>
                            </div>
                        </h5>
                        <hr>
                        <div class="level-right">
                            <button
                                class="button is-danger"
                                @click="controlMultiyear.editRow = null">
                                {{ i18n('Cancel') }}
                            </button>
                            <button
                                class="button is-success has-margin-left-medium"
                                @click="updateMultiyearCalendarLine()">
                                {{ i18n('Save') }}
                            </button>
                        </div>
                    </div>
                </modal>

                <confirm-modal :visible.sync="controlMultiyear.showRegenerate"
                    @submit="regenerateMultiyearCalendarLine()">
                    <template #header>
                        <div class="prolongation-notification notification is-danger">
                            <div class="has-margin-bottom-medium">
                                <p class="title is-6">
                                    {{ i18n('UVAHA!!!') }}
                                </p>
                            </div>
                            <span>{{ i18n('Pereformuvaty bahatorichnyy kalendar? Vsi ruchni zminy budut vtracheno!') }}</span>
                        </div>
                    </template>
                </confirm-modal>
            </div>

            <div class="addition-info-block">
                <div class="addition-info-block-title box level">
                    <div class="level-left">
                        <h3 class="title is-6">{{ i18n('Kalendar splat') }}</h3>
                    </div>

                    <div class="level-right">
                        <div
                            class="dropdown-indicator has-text-info"
                            @click="controlPolicePaymentCalendar.show = !controlPolicePaymentCalendar.show">

                            <dropdown-indicator :open="controlPolicePaymentCalendar.show" class="is-large fa-lg"/>
                        </div>
                    </div>
                </div>

                <div
                    v-if="controlPolicePaymentCalendar.show"
                    class="addition-info-content">

                    <div class="level-right has-margin-bottom-large">
                        <button
                            class="button is-info is-small"
                            @click="controlPolicePaymentCalendar.showRegenerate = true">
                            {{ i18n('Pereformuvaty') }}
                        </button>
                    </div>

                    <u-table
                        :template.sync="policyPaymentCalendarTemplate"
                        :table.sync="data.policyPaymentCalendarData"
                        @add-row="savePolicyPaymentCalendarLines($event.rowToAdd)"
                        @remove-row="removePolicyPaymentCalendarLines($event)"
                        ref="policyPaymentCalendarData">
                        <template #billing_url="{ row }">
                            <router-link
                                :to="{
                                    name: 'inwork.contracts.edit.printForm',
                                    params: {
                                        contractPrintingFormId: row.insurance_contract_printing_form_id || null,
                                    },
                                }"
                                class="button is-small is-table-button is-link">
                                <span class="icon"><fa icon="external-link-alt"/></span>
                            </router-link>
                        </template>

                        <template v-slot:[`tr_${controlPolicePaymentCalendar.editIndex}`]="{ index }">
                            <row-to-add
                                :template-data="$refs.policyPaymentCalendarData.templateData"
                                :key="data.policyPaymentCalendarData[index].rowId">
                                <template #addButton="{ rowToAdd, disabled }">
                                    <button
                                        key="save"
                                        :disabled="disabled"
                                        class="button is-small is-table-button is-success"
                                        @click="savePolicyPaymentCalendarLines(rowToAdd, data.policyPaymentCalendarData[controlPolicePaymentCalendar.editIndex].line_id)">
                                        <span class="icon is-small"><fa icon="check"/></span>
                                    </button>
                                    <button
                                        key="cancel"
                                        class="button is-small is-table-button is-light"
                                        @click="controlPolicePaymentCalendar.editIndex = null">
                                        <span class="icon is-small"><fa icon="times"/></span>
                                    </button>
                                </template>
                            </row-to-add>
                        </template>

                        <template #actions="{ index }">
                            <button
                                key="edit"
                                class="button is-small is-table-button is-warning"
                                :disabled="!!controlPolicePaymentCalendar.editIndex"
                                @click="editPolicyPaymentCalendarLine(index)">
                                <span class="icon is-small">
                                    <fa icon="pen"></fa>
                                </span>
                            </button>
                        </template>
                    </u-table>
                </div>

                <confirm-modal :visible.sync="controlPolicePaymentCalendar.showRegenerate"
                    @submit="regeneratePolicyPaymentCalendarLines()">
                    <template #header>
                        <div class="prolongation-notification notification is-danger">
                            <div class="has-margin-bottom-medium">
                                <p class="title is-6">
                                    {{ i18n('UVAHA!!!') }}
                                </p>
                            </div>
                            <span>{{ i18n('Pereformuvaty kalendar splat? Vsi ruchni zminy budut vtracheno!') }}</span>
                        </div>
                    </template>
                </confirm-modal>
            </div>
        </div>
    </div>
</template>

<script>
import relatedCalculations from './RelatedCalculations'
import multiyearTable from './MultiyearTable'
import policyPaymentCalendar from './PolicyPaymentCalendar'

import UTable from '@components/UTable'
import RowToAdd from '@components/RowToAdd'
import UInput from '@components/UInput'
import ConfirmModal from '@components/ConfirmModal'

import Commissions from './extendedCalculations/Commissions'

import { Modal } from '@enso-ui/bulma'
import DropdownIndicator from '@enso-ui/dropdown-indicator'
import { Fade } from '@enso-ui/transitions'
import moment from 'moment'

import errorHandler from '@components/mixins/errorHandler'

import smoothReflow from 'vue-smooth-reflow'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faExternalLinkAlt)

export default {
    components: {
        UTable,
        UInput,
        ConfirmModal,
        Modal,
        RowToAdd,
        DropdownIndicator,
        Fade,

        Commissions,
    },

    inject: ['i18n'],

    mixins: [
        errorHandler,
        smoothReflow,
        relatedCalculations,
        multiyearTable,
        policyPaymentCalendar,
    ],

    props: {
        detailedCalculation: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            commissionTable: [],
            show: false,
            calculationId: this.detailedCalculation.insurance_consultation_product_calculation_id.value,
            data: {
                insuranceLogicData: null,
                relatedCalculationsData: null,
                multiyearTableData: null,
                policyPaymentCalendarData: null,
                calculationCommissionsData: null,
            },
            controlInsuranceLogic: {
                show: false,
                showLogic: false,
            },
            controlCalculationCommissions: {
                show: true,
                showPolicy: false,
                edit: null,
                editRow: null,
            },
            controlRelatedCalculations: {
                show: true,
            },
            controlMultiyear: {
                show: true,
                insuranceLogic: null,
                editRow: null,
                showRegenerate: false,
            },
            controlPolicePaymentCalendar: {
                show: true,
                editIndex: null,
                showRegenerate: false,
            },
        };
    },

    mounted() {
        this.$smoothReflow({ el: '.addition-info' });
    },

    methods: {
        fetchExtendedCalculationData() {
            axios.get(route('inwork.contracts.fetchExtendedCalculationData'), {
                    params: {
                        calculation_id: this.detailedCalculation.insurance_consultation_product_calculation_id.value,
                    }
                })
                .then(({ data }) => {
                    this.data.insuranceLogicData = data.insuranceLogicData;
                    this.data.relatedCalculationsData = data.relatedCalculationsData;
                    this.data.multiyearTableData = data.multiyearTableData;
                    this.data.policyPaymentCalendarData = data.policyPaymentCalendarData.table;
                    this.data.calculationCommissionsData = data.calculationCommissionsData;

                    this.policyPaymentCalendarTemplate.columns.status_id.props.options = data.policyPaymentCalendarData.options.status;
                    this.policyPaymentCalendarTemplate.columns.type_id.props.options = data.policyPaymentCalendarData.options.type;

                    this.show = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        updateMultiyearCalendarLine() {
            axios.post(route('inwork.contracts.updateMultiyearCalendarLine'), this.controlMultiyear.editRow)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.controlMultiyear.editRow = null;
                    this.fetchExtendedCalculationData();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        regenerateMultiyearCalendarLine() {
            axios.post(
                    '/api/inwork/contracts/regenerateMultiyearCalendar',
                    { calculation_id: this.calculationId }
                )
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.fetchExtendedCalculationData();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        savePolicyPaymentCalendarLines(rowToAdd, lineId) {
            let rowToAddValues;

            if (lineId) {
                rowToAddValues = Object.fromEntries(
                    Object.entries(rowToAdd).map(([key, item]) => [key, item.value])
                );
            } else {
                rowToAddValues = rowToAdd;
            }

            axios.post(route('inwork.contracts.policyPaymentCalendarLines.save'), {
                    calculation_id: this.calculationId,
                    line_id: lineId,
                    ...rowToAddValues
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.fetchExtendedCalculationData();
                    this.controlPolicePaymentCalendar.editIndex = null;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        removePolicyPaymentCalendarLines(rowIndex) {
            axios.post(route('inwork.contracts.policyPaymentCalendarLines.delete'), {
                    line_id: this.data.policyPaymentCalendarData[rowIndex].line_id,
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.fetchExtendedCalculationData();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        regeneratePolicyPaymentCalendarLines() {
            axios.post(
                    route('inwork.contracts.policyPaymentCalendarLines.regenerate'),
                    { calculation_id: this.calculationId }
                )
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.fetchExtendedCalculationData();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        editPolicyPaymentCalendarLine(index) {
            this.controlPolicePaymentCalendar.editIndex = index;

            Object.entries(this.data.policyPaymentCalendarData[index]).forEach(([key, value]) => {
                if (this.policyPaymentCalendarTemplate.columns[key]) {
                    this.policyPaymentCalendarTemplate.columns[key].default = value;
                }
            });
        },
    },

    filters: {
        formatDate(date) {
            return moment(date).format('HH:mm DD.MM.YYYY');
        },
    },
};
</script>

<style lang="sass">
.addition-info
    &-dropdown
        display: flex
        justify-content: center
        .dropdown-indicator
            padding: 1rem
            font-size: 1.125rem
    &-title
        margin: 0 -15px 1rem
        box-shadow: 0 1px 2px rgba(10, 10, 10, 0.1)
        padding: 15px
        padding-right: 0
        display: flex
        align-items: center
        .angel
            margin-left: auto
            margin-right: 10px
            cursor: pointer
    &-block
        margin-bottom: 10px
        .title
            margin-bottom: 0
        .level
            margin-bottom: 0
        &-title
            background-color: whitesmoke
            padding: 0 1.5rem
    &-content
        margin-top: .7rem
        margin-bottom: 1.5rem
        .commissions-button
            cursor: pointer
            display: flex
            align-items: center
        &.logic-block
            margin-top: 0
            margin-bottom: .7rem
    .related-calculation-is-3of2
        width: 5.55555555%
    .message
        box-shadow: 0 0.5em 1.5em -0.125em rgba(10, 10, 10, 0.01), 0 0px 0 1px rgba(10, 10, 10, 0.1)
        &-body
            white-space: pre-wrap
            max-height: 300px
            overflow-y: auto
.dropdown-indicator
    display: flex
    align-items: center
    cursor: pointer
.table
    &-calendar
        position: relative
        .icon
            cursor: pointer
    &-hello-board
        position: absolute
        top: -60px
        left: 10%
        width: 80%
        z-index: 999
        .message
            overflow-y: auto
            max-height: 400px
.calculation-commissions
    &-header
        align-items: center
        margin: 10px
    &-calculate
        margin-bottom: 25px
        .calculate-item
            align-items: center
            padding: 0 .75rem
            .tag
                justify-content: flex-start

</style>

