<template>
    <div>
        <div class="consultation__parameters_history has-margin-top-large">
            <slot name="header"/>

            <u-table
                :template="consultationHistoryTemplate"
                :table.sync="data.productsTable"
                :search="data.search"
                :scroll="6"
                ref="consultationHistoryData">
                <template #product_status="{ row }">
                    <div v-if="row.prolongation_contract_code"
                        class="has-margin-bottom-medium">
                        <div class="label has-text-weight-bold has-text-danger">{{ i18n('Prolonhatsiya') }}</div>
                        <div class="tag is-normal is-danger">{{ row.prolongation_contract_code }}</div>
                    </div>
                    <span>{{ row.product_status }}</span>
                </template>

                <template #product_parameters="{ row }">
                    <span
                        v-html="row.product_parameters"
                        class="tag"
                    />
                </template>

                <template #actions="{ row, index }">
                    <div v-if="data.stateAlias !== 'actualization'"
                        class="is-table-button">
                        <input
                            v-model="row.checkbox.value"
                            type="checkbox"
                            :id="`checkbox-${index}`"
                            :name="`checkbox-${index}`"
                            :disabled="!row.checkbox.enabled"
                            @change="
                                setCheckedRows();
                                $set(data.status, 'alias', row.calculation_status);
                            "
                            class="is-checkradio is-info"
                        >

                        <label :for="`checkbox-${index}`"/>
                    </div>

                    <button
                        @click="setExtraParams(row, index)"
                        class="button is-small is-table-button is-info">
                        <span class="icon is-small">
                            <fa icon="info"/>
                        </span>
                    </button>
                </template>
            </u-table>

            <params
                v-show="consultationHistoryData.extraParams.rows.length > 0"
                :extra-params="consultationHistoryData.extraParams"
                @close="
                    consultationHistoryData.extraParams.rows = [];
                    $refs.consultationHistoryData.setActiveRow();
                "
                ref="historyExtraParams"/>

            <slot name="footer"/>
        </div>
    </div>
</template>

<script>
    import UTable from '@components/UTable'
    import Params from './ExtraParams'

    import ConsultationHistory from '@templates/parametersCard/ConsultationHistory.js'

    import smoothReflow from 'vue-smooth-reflow'

    import concatFieldsString from '@components/mixins/concatFieldsString'
    import tableColorMarker from '@components/mixins/tableColorMarker'

    export default {
        components: {
            UTable,
            Params,
        },

        mixins: [
            ConsultationHistory,
            smoothReflow,
            concatFieldsString,
            tableColorMarker,
        ],

        inject: ['i18n'],

        props: {
            consultationHistoryData: Object,
        },

        data() {
            return {
                data: this.consultationHistoryData,
            };
        },

        created() {
            this.getData();
        },

        mounted() {
            this.$smoothReflow();
        },

        methods: {
            getData() {
                axios.get(route(this.data.route.url), this.data.route)
                    .then(({ data }) => {
                        this.data.productsTable = data.historyTable;

                        this.data.productsTable.forEach((row) => {
                            this.$set(row, 'checkbox', {
                                value: false,
                                enabled: true,
                            });

                            row.customClass = this.getRowCustomColorName(row.calculation_status);
                        });

                        this.$emit('get-history', data);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            setExtraParams(row, activeRowIndex) {
                const formattedCalculations = row.calculations.map(
                    ({ data: productRecalcObject, fields }) => {
                        const setSwitcherInvisibility = ((key) => {
                            if (fields.recalc.hasOwnProperty(key) && !productRecalcObject.recalc_fields.hasOwnProperty(key)) {
                                delete fields.recalc[key];
                            }
                        });

                        setSwitcherInvisibility('is_incident_bank_on_credit');
                        setSwitcherInvisibility('is_kasko_bank_on_credit');

                        return { productRecalcObject, fields };
                    }
                );

                this.data.extraParams.rows = formattedCalculations;

                this.$refs.consultationHistoryData.setActiveRow(activeRowIndex);
            },

            setCheckedRows() {
                const checkedRows = this.data.productsTable.filter(row => row.checkbox.value);

                this.emitSingleOrMultipleCheckedStatus({
                    checkedRows,
                    defaultButtons: {
                        create: false,
                        goto: false,
                        compare: false,
                    },
                });

                this.data.checkedRows = checkedRows;
            },

            setSingleCheckedStatus(checkedRow, checkedStatus) {
                this.data.buttonsStatus = {
                    create: checkedStatus === 'createdConsultation',
                    goto: checkedStatus !== 'createdConsultation' && checkedStatus !== 'closedConsultation',
                    compare: true,
                };

                this.setCheckboxDisableStatus(checkedRow);
            },

            setMultipleCheckedStatus(checkedRows) {
                const comparableRow = checkedRows[0];

                const createdConsultationAndCreditSubtype = checkedRows.every((checkedRow) => {
                    return checkedRow.product_subtype_alias === 'vehicleCarLoan'
                        && checkedRow.calculation_status === 'createdConsultation';
                });

                const sameConsultationAndSubtype = checkedRows.every((checkedRow) => {
                    return checkedRow.insurance_consultation_id === comparableRow.insurance_consultation_id
                        && checkedRow.product_subtype_alias === comparableRow.product_subtype_alias;
                });

                this.data.buttonsStatus = {
                    create: createdConsultationAndCreditSubtype,
                    goto: false,
                    compare: sameConsultationAndSubtype,
                };

                this.setCheckboxDisableStatus(comparableRow);
            },
        },
    };
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"

.consultation
    &__parameters
        padding: 1rem 0

        .is-divider
            margin: 1.5rem -24px

        &_fields
            margin-bottom: 1rem
            &._disabled
                opacity: .5
                position: relative
                pointer-events: none
                &::before
                    content: ''
                    position: absolute
                    left: 0
                    top: 0
                    background-color: #fff
                    opacity: .5
                    width: 100%
                    height: 100%
                    z-index: 9
            .dropdown .dropdown-menu .dropdown-content a.dropdown-item
                white-space: normal

        &_products
            .product__buttons
                padding: .5em 0
                display: flex
                justify-content: flex-end
        &_list
            margin-bottom: 2.5rem
        &_choosed
            padding-bottom: .5rem

        &_history
            .column_product_parameters
                .tag
                    width: 100%
                    height: auto
                    flex-wrap: wrap
                    white-space: normal
                    flex-direction: column
                    align-items: flex-start
                    hr
                        margin: .2rem 0
                        background: #fff
                        width: 100%
                    +desktop-only
                        flex-direction: row
                        justify-content: space-between
                        flex-wrap: wrap
                        b
                            white-space: nowrap
                    +touch
                        flex-direction: row
                        justify-content: space-between
                        flex-wrap: wrap
                        b
                            white-space: nowrap
                +mobile
                    &::before
                        width: 100%
                    >div
                        width: 100%
                    .tag
                        font-size: 0.8rem
                        // display: block
                        // span
                        //     margin-right: 0.5rem

            &Header
                margin-bottom: .6rem !important
                .title
                    font-size: 1.05rem
                    margin-bottom: 0

</style>
