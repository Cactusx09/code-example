<template>
    <div v-if="inited">
        <div>
            <u-table
                :template="selectedProductsTemplate"
                :table.sync="data.productsTable"
                :scroll="5"
                class="parameters_products__selected"
                ref="selectedProducts">
                <template #bank="{ row }">
                    <div class="level">
                        <span>{{ row.bank }}</span>
                        <span class="icon has-tooltip has-text-info has-margin-left-large"
                            v-tooltip="`
                                <span class='tag is-info has-margin-right-medium has-margin-bottom-large'>${row.product_code}</span> <b>${row.product_name}</b> <br>
                                ${row.product_description}
                            `">
                            <fa icon="info-circle"
                                size="lg"/>
                        </span>
                    </div>

                    <div v-if="row.is_action" class="tag is-normal is-danger has-margin-top-medium">
                        {{ i18n('Aktsiya') }}!!!
                    </div>
                </template>

                <template #productRateString="{ row }">
                    <span class="tag is-medium has-margin-bottom-medium" style="width: 100%">
                        {{ concatFieldsString(selectedProductsFields.select, row.productRecalcObject) }}
                    </span>
                    <div v-if="row.product_rate !== null" class="tags">
                        <span class="tag is-spacebetween">
                            <span class="tag-spacebetween-item">
                                <span>{{ `${i18n('Pershyy vnesok')}, ${i18n('hrn')}` }}</span>
                                <b>{{ row.productRecalcObject.total_credit_prepayment }}</b>
                            </span>
                            <span class="tag-spacebetween-item">
                                <span>{{ `${i18n('Summa kredytu')}, ${i18n('hrn')}` }}</span>
                                <b>{{ row.productRecalcObject.total_credit_amount }}</b>
                            </span>
                        </span>
                    </div>
                </template>

                <template #parameters="{ row }">
                    <div class="tags">
                        <span class="tag is-spacebetween">
                            <template v-if="row.product_rate !== null">
                                <span v-if="row.productRecalcObject.monthly_bank_commission_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Komisiya shchomisyatsya')}, %` }}</span>
                                    <b>{{ row.productRecalcObject.monthly_bank_commission_rate }}</b>
                                </span>

                                <span v-if="row.productRecalcObject.credit_offer_commission_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Razova komisiya')}, %` }}</span>
                                    <b>{{ row.productRecalcObject.credit_offer_commission_rate }}</b>
                                </span>

                                <span v-if="row.productRecalcObject.commission_other_amount"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Dod. vytraty')}, ${i18n('hrn')}` }}</span>
                                    <b>{{ row.productRecalcObject.commission_other_amount }}</b>
                                </span>
                                <span v-if="row.productRecalcObject.credit_commission_other_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Dod. vytraty')}, %` }}</span>
                                    <b>{{ row.productRecalcObject.credit_commission_other_rate }}</b>
                                </span>
                            </template>

                            <span v-if="row.notarial_processing_cost"
                                class="tag-spacebetween-item">
                                <span>{{ `${i18n('Notarius')}, ${i18n('hrn')}` }}</span>
                                <b>{{ row.notarial_processing_cost }}</b>
                            </span>

                            <span v-if="row.insurance_credit"
                                class="tag-spacebetween-item">
                                <span>{{ i18n('Kasko v kredyt') }}</span>
                                <b>{{ row.insurance_credit }}</b>
                            </span>
                        </span>
                    </div>
                </template>

                <template #th_linkedProducts>
                    <div class="columns parameters_products__selected_linkedHead">
                        <div
                            v-for="(column, index) in selectedLinkedProductsTableTemplate.columns" :key="index"
                            :class="[
                                'column',
                                column.class,
                                column.align ? selectedProductsTemplate.aligns[column.align] : selectedProductsTemplate.align,
                            ]">
                            <div class="level">
                                <span>{{ i18n(column.label) }}</span>
                            </div>
                        </div>
                    </div>
                </template>

                <template #linkedProducts="{ row: productsTableRow }">
                    <u-table
                        :template.sync="selectedLinkedProductsTableTemplate"
                        :table.sync="productsTableRow.linkedProducts"
                        class="parameters_products__selected_linkedTable">
                        <template #thead><div></div></template>
                        <template #selectedCalculations="{ row, row: { productsTable } }">
                            <div class="tag">
                                {{ productsTable[0].productRecalcObject.product_code }} - {{ productsTable[0].productRecalcObject.product_name }}
                                <br/>
                                {{ concatFieldsString(row.fields.select, productsTable[0].productRecalcObject) }}
                            </div>
                        </template>
                    </u-table>
                </template>
                <template #actions="{ row, index }">
                    <div
                        class="is-table-button">
                        <input
                            v-model="row.checkbox.value"
                            type="checkbox"
                            :id="`checkbox-${index}`"
                            :name="`checkbox-${index}`"
                            :disabled="!row.checkbox.enabled"
                            @change="
                                setCheckedRows();
                            "
                            class="is-checkradio is-info">
                        <label :for="`checkbox-${index}`"/>
                    </div>
                    <button
                        @click="setExtraParams(row, index)"
                        class="button is-small is-table-button is-info">
                        <span class="icon is-small">
                            <fa icon="info" />
                        </span>
                    </button>
                    <button
                        v-if="row.calculation_status == 'agreedEditedCreditCalculation'"
                        @click="getQuotedParameters(row.id)"
                        class="button is-small is-table-button is-warning">
                        <span class="icon is-small">
                            <fa icon="question"/>
                        </span>
                    </button>
                </template>
            </u-table>

            <params
                v-show="data.extraParams.rows.length > 0"
                :extra-params="data.extraParams"
                @close="
                    data.extraParams.rows = [];
                    $refs.selectedProducts.setActiveRow();
                "/>

            <div class="columns has-margin-top-large">
                <div class="column is-5">
                    <div class="columns">
                        <div
                            v-if="data.statusEdit.isVisible && data.buttonsStatus.changeStatus"
                            class="column is-7">
                            <vue-select
                                v-model="data.statusEdit.status_id"
                                :placeholder="i18n('Oberit status')"
                                :options="data.statusEdit.status_options"
                                @clear="data.statusEdit.isVisible = false"
                                @deselect="data.statusEdit.isVisible = false"/>
                        </div>
                        <div class="column is-4 level">
                            <div class="level-left">
                                <button
                                    @click="
                                        data.statusEdit.isVisible
                                            ? saveStatus()
                                            : getStatusEdit();
                                    "
                                    :disabled="!data.buttonsStatus.changeStatus"
                                    class="button is-info">
                                    {{ i18n('Zminyty status') }}
                                </button>

                                <button
                                    v-if="data.buttonsStatus.editProduct"
                                    @click="getModalEditProductData(data.checkedRows[0])"
                                    class="button has-margin-left-large is-warning">
                                    {{ i18n('Edit') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="column is-7 level">
                    <div class="level-right">
                        <button
                            v-if="data.checkedRows.length === 0"
                            @click="getModalAddProductData()"
                            class="button has-margin-left-large is-info">
                            {{ i18n('Dodaty produkt') }}
                        </button>
                        <button
                            :disabled="!data.buttonsStatus.send"
                            @click="sendRequestToBank()"
                            class="button has-margin-left-large is-info">
                            {{ i18n('Nadislaty zayavku v bank') }}
                        </button>
                        <button
                            :disabled="!data.buttonsStatus.choose"
                            @click="data.modalChooseCalculation.isVisible = true"
                            class="button has-margin-left-large is-success">
                            {{ i18n('Obraty') }}
                        </button>
                    </div>
                </div>
            </div>

            <textarea
                v-if="data.statusEdit.isVisible && data.buttonsStatus.changeStatus"
                v-model="data.statusEdit.notes"
                :placeholder="i18n('Prymitka')"
                class="textarea"/>
        </div>

        <modal-card
            :show="data.modalAddProductData.isVisible"
            @close="data.modalAddProductData.isVisible = false"
            class="add-calculation-modal">
            <template #header>
                <div class="title is-5">{{ i18n('Dodaty produkt') }}</div>
            </template>

            <template #body>
                <parameters-card
                    :state-id="{
                        id: stateId,
                        name: 'insurance_contract_id',
                    }"
                    :parameters-options="data.modalAddProductData.parametersOptions"
                    @saved-params="
                        getCalculationsByContract();
                        data.modalAddProductData.isVisible = false;
                    "
                />
            </template>
        </modal-card>

        <modal-card
            :show="data.modalEditProductData.isVisible"
            @close="data.modalEditProductData.isVisible = false"
            class="add-calculation-modal">
            <template #header>
                <div class="title is-5">{{ i18n('Redahuvaty produkt') }}</div>
            </template>

            <template #body>
                <parameters-card
                    :state-id="{
                        id: data.checkedRows[0].id,
                        name: 'insurance_consultation_product_id',
                    }"
                    :parameters-options="data.modalEditProductData.parametersOptions"
                    @saved-params="
                        getCalculationsByContract();
                        data.modalEditProductData.isVisible = false;
                    "
                />
            </template>
        </modal-card>

        <modal-card
            :show="data.modalQuotedProductData.isVisible"
            @close="data.modalQuotedProductData.isVisible = false"
            class="quoted-calculation-modal">

            <template #body>
                <calculation-card-child
                    :data="data.modalQuotedProductData.data"
                    :label="'Kredytni parametry na pohodzhennya'"/>

                <calculation-card-child
                    :data="data.modalQuotedProductData.quotedData"
                    :label="'Skoryhovani kredytni parametry'"/>
            </template>

            <template #footer>
                <div class="column level">
                    <div class="level-right">
                        <button
                            class="button is-danger"
                            @click="data.modalQuotedProductData.isVisible = false">
                            <span class="is-hidden-mobile">
                                {{ i18n('cancle') }}
                            </span>
                        </button>

                        <button
                            class="button is-info"
                            @click="
                                data.modalQuotedProductData.isVisible = false;
                                $router.push({
                                    name: 'administration.insuranceProducts.create',
                                    params: {
                                        calculationId: data.modalQuotedProductData.data.insurance_consultation_product_calculation_id.value,
                                    }
                                });
                            ">
                            <span class="is-hidden-mobile">
                                {{ i18n('Kotyruvaty dohovir') }}
                            </span>
                        </button>
                    </div>
                </div>
            </template>
        </modal-card>

        <confirm-modal :visible.sync="data.modalChooseCalculation.isVisible"
            title="Obraty kredytnu/lizinhovu propozytsiyu"
            @submit="chooseCalculation()">
        </confirm-modal>
    </div>
</template>

<script>
    import UTable from '@components/UTable'
    import { VueSelect } from '@enso-ui/select/bulma'
    import { ModalCard } from '@enso-ui/modal/bulma'
    import { VTooltip } from 'v-tooltip'

    import ConfirmModal from '@components/ConfirmModal'

    import ParametersCard from '@components/cards/parameters/ParametersCard'
    import Params from './ExtraParams'
    import CalculationCardChild from '@components/cards/calculationCard/CalculationCardChild'

    import SelectedProducts from '@templates/parametersCard/SelectedProducts.js'

    import smoothReflow from 'vue-smooth-reflow'

    import concatFieldsString from '@components/mixins/concatFieldsString'
    import errorHandler from '@components/mixins/errorHandler'
    import tableColorMarker from '@components/mixins/tableColorMarker'

    export default {
        directives: { tooltip: VTooltip },

        components: {
            UTable,
            VueSelect,
            ModalCard,
            ConfirmModal,

            ParametersCard,
            CalculationCardChild,
            Params,
        },

        mixins: [
            SelectedProducts,
            smoothReflow,
            concatFieldsString,
            errorHandler,
            tableColorMarker,
        ],

        inject: ['i18n'],

        props: {
            stateId: {
                type: Number,
            },
        },

        data() {
            return {
                inited: false,
                selectedProductsFields: {},
                data: {
                    productsTable: [],
                    extraParams: {
                        rows: [],
                        disabled: true,
                    },
                    checkedRows: [],
                    buttonsStatus: {
                        send: false,
                        edit: false,
                        choose: false,
                        changeStatus: false,
                        editProduct: false,
                    },

                    statusEdit: {},

                    modalAddProductData: {
                        isVisible: false,
                        data: {},
                        parametersOptions: {
                            stateAlias: 'credit',
                            alias: 'vehicleCarLoan',
                            parametersStructure: null,
                            // productsData: null,
                            apiRoutes: {
                                getForm: {
                                    url: 'insuranceprogramparams.getData',
                                },
                                suggestProducts: 'inwork.contracts.creditSolutions.selectedProducts.suggestProducts',
                                recalculate: 'inwork.contracts.creditSolutions.selectedProducts.recalculate',
                                saveProductData: 'inwork.contracts.creditSolutions.selectedProducts.saveProductData',
                                testInsuranceLogic: 'inwork.contracts.creditSolutions.selectedProducts.testInsuranceLogic',
                            },
                        },
                    },
                    modalEditProductData: {
                        isVisible: false,
                        data: {},
                        parametersOptions: {
                            stateAlias: 'insurance',
                            parametersStructure: null,
                            // productsData: null,
                            apiRoutes: {
                                getForm: {
                                    url: 'insuranceprogramparams.getData',
                                },
                                suggestProducts: 'inwork.contracts.creditSolutions.selectedProducts.nestedCalculations.suggestProducts',
                                recalculate: 'inwork.contracts.creditSolutions.selectedProducts.nestedCalculations.recalculate',
                                saveProductData: 'inwork.contracts.creditSolutions.selectedProducts.nestedCalculations.save',
                                testInsuranceLogic: 'inwork.contracts.creditSolutions.selectedProducts.nestedCalculations.testInsuranceLogic',
                            },
                        },
                    },
                    modalQuotedProductData: {
                        isVisible: false,
                        data: {},
                        quotedData: {},
                    },
                    modalChooseCalculation: {
                        isVisible: false,
                    },
                },
            }
        },

        created() {
            this.getCalculationsByContract();
        },

        mounted() {
            this.$smoothReflow();
        },

        methods: {
            getCalculationsByContract() {
                axios.get(route('inwork.contracts.creditSolutions.selectedProducts.getData'), {
                        params: {
                            insurance_contract_id: this.stateId
                        },
                    })
                    .then(({ data: { selectedProductsTable, wizard } }) => {
                        this.selectedProductsFields = selectedProductsTable.fields;
                        this.data.productsTable = selectedProductsTable.productsTable;
                        this.wizards = wizard;

                        this.data.productsTable.forEach((row) => {
                            row.checkbox = {
                                value: false,
                                enabled: true,
                            };

                            row.customClass = this.getRowCustomColorName(row.calculation_status);
                        });

                        this.inited = true;
                        this.$emit('get-contract-created-at', this.data.productsTable[0].date);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            setCheckedRows() {
                let checkedRows = this.data.productsTable.filter((row, index) => row.checkbox.value);

                this.emitSingleOrMultipleCheckedStatus({
                    checkedRows,
                    defaultButtons: {
                        send: false,
                        edit: false,
                        choose: false,
                        changeStatus: false,
                    },
                });
                this.data.checkedRows = checkedRows;
            },
            setSingleCheckedStatus(checkedRow, checkedStatus) {
                const isPrimary = checkedRow.is_primary;

                this.data.buttonsStatus = {
                    send: ['formCreditRequest', 'expertRequestCreditCalculation', 'opercentrRequestCreditCalculation'].includes(checkedStatus),
                    edit: checkedStatus === 'agreedEditedCreditCalculation',
                    choose: isPrimary || ['agreedCreditCalculation', 'agreedEditedCreditCalculation', 'agreedProgramNotFound'].includes(checkedStatus),
                    changeStatus: true,
                    editProduct: checkedStatus === 'agreedNeedsAction',
                };

                this.setCheckboxDisableStatus(checkedRow);
            },
            setMultipleCheckedStatus(checkedRows, checkedStatusesArr) {
                const comparableRow = checkedRows[0];

                const sendStatusesIncludes = checkedStatusesArr.every((status) => ['formCreditRequest', 'expertRequestCreditCalculation', 'opercentrRequestCreditCalculation'].includes(status));

                this.data.buttonsStatus = {
                    send: sendStatusesIncludes,
                    edit: false,
                    choose: false,
                    changeStatus: true,
                };

                this.setCheckboxDisableStatus(comparableRow);
            },

            setExtraParams(creditRow, activeRowIndex) {
                let formattedCalculations = creditRow.linkedProducts.map((linkedRow) => ({
                    productRecalcObject: linkedRow.productsTable[0].productRecalcObject,
                    fields: linkedRow.fields,
                }));

                formattedCalculations.unshift({
                    fields: this.selectedProductsFields,
                    ...creditRow
                });

                this.data.extraParams.rows = formattedCalculations;

                this.$refs.selectedProducts.setActiveRow(activeRowIndex);
            },

            getStatusEdit() {
                axios.get(route('inwork.contracts.creditSolutions.fetchCalculationStatusState'), {
                        params: {
                            insurance_contract_id: this.stateId
                        },
                    })
                    .then(({ data }) => {
                        this.data.statusEdit = {
                            isVisible: true,
                            ...data
                        };
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
            saveStatus() {
                const requestData = {
                    ...this.data.statusEdit,
                    calculation_ids: this.data.checkedRows.map((row) => row.primary_calculation_product_id),
                };

                axios.post(route('inwork.contracts.creditSolutions.saveCalculationStatusState'), requestData)
                    .then(({ data }) => {
                        this.$toastr.success('Status uspishno zmineno');

                        this.data.statusEdit.isVisible = false;

                        this.getCalculationsByContract();
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            getModalAddProductData() {
                axios.get(route('inwork.contracts.creditSolutions.selectedProducts.fetchAddProductForm'), {
                        params: {
                            insurance_contract_id: this.stateId,
                        }
                    })
                    .then(({ data }) => {
                        this.data.modalAddProductData.parametersOptions.parametersStructure = data.parametersStructure;

                        this.data.modalAddProductData.isVisible = true;
                        this.$emit('update', data);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                        this.$emit('close');
                    });
            },

            getModalEditProductData(row) {
                axios.get(route('inwork.contracts.creditSolutions.selectedProducts.nestedCalculations.edit'), {
                params: {
                            insurance_contract_id: this.stateId,
                            insurance_consultation_product_id: row.id,
                        }
                    })
                    .then(({ data }) => {
                        this.data.modalEditProductData.parametersOptions.parametersStructure = data.searchConditions;
                        this.data.modalEditProductData.parametersOptions.alias = 'vehicleCarLoan';

                        this.data.modalEditProductData.isVisible = true;
                        this.$emit('update', data);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                        this.$emit('close');
                    });
            },

            sendRequestToBank() {
                const checkedRowsPrimaryIds = this.data.checkedRows.map((row) => row.primary_calculation_product_id);

                axios.get(route('inwork.contracts.creditSolutions.sendBankRequest'), {
                        params: {
                            calculation_ids: checkedRowsPrimaryIds,
                        },
                    })
                    .then(({ data }) => {
                        this.$toastr.success(data.message);

                        this.getCalculationsByContract();
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            getQuotedParameters(consultationProductId) {
                axios.get(route('inwork.contracts.creditSolutions.quotedParameters.fetchCard'), {
                        params: {
                            insurance_consultation_product_id: consultationProductId,
                        }
                    })
                    .then(({ data }) => {
                        this.data.modalQuotedProductData = {
                            isVisible: true,
                            data: data.data,
                            quotedData: data.quotedData,
                        };
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            chooseCalculation() {
                const checkedRow = this.data.checkedRows[0];

                axios.get(route('inwork.contracts.creditSolutions.choosePrimaryCalculationGroup'), {
                        params: {
                            calculation_group_id: checkedRow.id,
                        },
                    })
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                        this.getCalculationsByContract();

                        this.data.modalChooseCalculation.isVisible = false;
                    })
                    .catch((error) => {
                        this.data.modalChooseCalculation.isVisible = false;

                        this.errorHandler(error);
                    });
            },
        },
    }
</script>

<style lang="sass">
.parameters_products
    &__selected,
        .utable-tr.is-active
                .column_linkedProducts
                    .utable-tr
                        color: #209cee
                        font-weight: 700
                        &:last-of-type td
                                border-bottom: 1px solid #209cee !important
        .tags
            justify-content: center
            width: 100%
            &:not(:last-child)
                margin-bottom: 0.5rem
            .tag.is-spacebetween
                width: 100%
                height: auto
                white-space: normal
                padding-top: .35em
                padding-bottom: .35em
                display: flex
                flex-direction: column
                &:not(:last-child)
                    margin-right: 0
                .tag-spacebetween-item
                    width: 100%
                    display: flex
                    justify-content: space-between
                    align-items: center
                    span
                        flex-grow: 2
                        display: flex
                        &::after
                            content: ''
                            border-bottom: 1px dotted #dbdbdb
                            flex-grow: 2
                            margin-bottom: 3px
                    b
                        white-space: nowrap

        .column_product_status
            white-space: pre-line
            word-break: break-word

        .column_linkedProducts
            padding: 0
            align-items: stretch
            .columns
                margin: 0
                .column
                    &:last-of-type
                        border-right: none

        .column_calculations
            .vue-select
                &:not(:last-of-type)
                    margin-bottom: .2rem

        &_linked
            &Head
                align-items: stretch
                width: 100%
                .column
                    border-right: 1px solid #dbdbdb
                    display: flex
                    justify-content: center
                    align-items: center
            &Table
                width: 100%
                display: flex
                align-items: stretch
                .table
                    &-header
                        display: none
                    &-responsive
                        display: flex
                        align-items: stretch
                    &-body
                        width: 100%
                        display: flex
                        align-items: stretch
                .utable
                    &__table
                        display: flex
                        flex-direction: column
                    &-tr
                        width: 100%
                        flex: 2
                        margin-bottom: -1px
                        &:not(.utable__rowtoadd):hover
                            background: none
                        &:not(:last-of-type)
                        border-bottom: 1px solid #dbdbdb
                    &-td
                        border-top: none
                        &:first-of-type
                            border-left: none
                        &:last-of-type
                            border-right: none
                .tag
                    height: auto
                    white-space: normal
                    word-break: break-word
</style>
