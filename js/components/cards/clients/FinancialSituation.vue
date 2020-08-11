<template>
    <div v-if="init" class="financial box">
        <div class="title is-5">
            <b class="title is-4">{{ $route.params.clientPIB }}</b>
        </div>

        <div class="financial__work financial__block">
            <vue-form
                :path="''"
                :i18n="i18n"
                :template="data.form"
                :locale="$store.getters['preferences/lang']"
                ref="financialSituation"
                @ready="ready()">
                <template #work_company_phone="props">
                    <label class="label">{{ i18n(props.field.label) }}</label>
                    <input-phone v-bind="props"/>
                </template>
                <template #work_company_hr_phone="props">
                    <label class="label">{{ i18n(props.field.label) }}</label>
                    <input-phone v-bind="props"/>
                </template>

                <template #work_region_id="props">
                    <form-field
                        v-bind="props"
                        @input="$refs.financialSituation.field('work_city_id').meta.params.region_id = $event"/>
                </template>
                <template #work_city_id="props">
                    <form-field
                        v-bind="props"
                        :params="props.field.meta.params"/>
                </template>

                <template #work_begin_date="props">
                    <form-field
                        v-bind="props"
                        @input="displayPreviousWork()"/>
                </template>
            </vue-form>
        </div>

        <div class="financial__incomes financial__block">
            <h3 class="title is-5">{{ i18n('Dokhody pozychalnyka') }}</h3>
            <u-table
                :template.sync="financialIncomesTemplate"
                :table.sync="data.financialIncomesTable"
                @remove-row="checkRequiredValue('financialIncomes', 'income_type_id', 1)"
                @add-row="checkRequiredValue('financialIncomes', 'income_type_id', 1)"
                :scroll="5"
                ref="financialIncomes">
            </u-table>
        </div>

        <div class="financial__costs financial__block">
            <h3 class="title is-5">{{ i18n('Zahalni vytraty simyi') }}</h3>
            <u-table
                :template.sync="financialCostsTemplate"
                :table.sync="data.financialCostsTable"
                @remove-row="checkRequiredValue('financialCosts', 'cost_type_id', 8)"
                @add-row="checkRequiredValue('financialCosts', 'cost_type_id', 8)"
                :scroll="5"
                ref="financialCosts">
            </u-table>
        </div>

        <div class="financial__credits financial__block">
            <h3 class="title is-5">{{ i18n('Kredytna istoriya') }}</h3>
            <u-table
                :template.sync="financialCreditsTemplate"
                :table.sync="data.financialCreditsTable"
                :scroll="5">
            </u-table>
        </div>

        <div class="financial__credits financial__block">
            <h3 class="title is-5">{{ i18n('Simeyna vlasnist') }}</h3>
            <u-table
                :template.sync="spousePropertiesTemplate"
                :table.sync="data.spousePropertiesTable"
                :scroll="5"
                @input-property-type-id="setPlaceholders()"
                ref="spouseProperties">
            </u-table>
        </div>
    </div>
</template>

<script>
    import { VueForm, FormField } from '@enso-ui/forms/bulma'

    import UTable from '@components/UTable'

    import FinancialIncomes from '@templates/financialSituation/FinancialIncomes.js'
    import FinancialCosts from '@templates/financialSituation/FinancialCosts.js'
    import FinancialCredits from '@templates/financialSituation/FinancialCredits.js'
    import SpouseProperties from '@templates/financialSituation/SpouseProperties.js'

    import InputPhone from '@components/vueforms/InputPhone'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import {
        faEyeSlash,
    } from '@fortawesome/free-solid-svg-icons'
    library.add([faEyeSlash])

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            VueForm,
            FormField,
            UTable,
            InputPhone,
        },

        inject: ['i18n'],

        mixins: [
            FinancialIncomes,
            FinancialCosts,
            FinancialCredits,
            SpouseProperties,
            errorHandler,
        ],

        props: {
            clientSnapshotId: {
                required: false,
            },
            contractId: {
                required: false,
                type: [Number, String],
            },
            contractCreatedAt: {
                type: String,
                default: null,
            },
        },

        data() {
            return {
                data: {
                    form: {},
                },

                init: false,
            }
        },

        created() {
            this.getFields();
        },

        methods: {
            ready() {
                this.$nextTick(() => this.displayPreviousWork());
            },

            getFields() {
                axios.get(route('inwork.contracts.questionnaires.getFinancialSituationByClient'), {
                        params: {
                            client_snapshot_id: this.clientSnapshotId,
                            insurance_contract_id: this.contractId,
                        },
                    })
                    .then(({ data }) => {
                        this.financialIncomesTemplate.columns.income_type_id.props.options = data.options.income_type_id;
                        this.financialCostsTemplate.columns.cost_type_id.props.options = data.options.cost_type_id;
                        this.financialCreditsTemplate.columns.credit_purpose_id.props.options = data.options.credit_purpose_id;
                        this.financialCreditsTemplate.columns.currency_id.props.options = data.options.currency_id;
                        this.spousePropertiesTemplate.columns.property_type_id.props.options = data.options.property_type_id;
                        this.spousePropertiesTemplate.columns.property_ownership_type_id.props.options = data.options.property_ownership_type_id;

                        this.data.form = data.form;
                        this.$set(this.data, 'financialCreditsTable', data.financialCreditsTableData);
                        this.$set(this.data, 'financialCostsTable', data.financialCostsTableData);
                        this.$set(this.data, 'financialIncomesTable', data.financialIncomesTableData);
                        this.$set(this.data, 'spousePropertiesTable', data.spousePropertiesTableData);

                        this.init = true;

                        this.checkRequiredValue('financialIncomes', 'income_type_id', 1);
                        this.checkRequiredValue('financialCosts', 'cost_type_id', 8);

                        this.$emit('on-get-data', data);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            setPlaceholders() {
                this.$nextTick(() => {
                    const placeholders = this.$refs.spouseProperties.getRowToAdd('property_type_id').selection.placeholders;

                    this.spousePropertiesTemplate.columns.parameter_1.props.placeholder = placeholders && placeholders.parameter_1 || '';
                    this.spousePropertiesTemplate.columns.parameter_2.props.placeholder = placeholders && placeholders.parameter_2 || '';
                    this.spousePropertiesTemplate.columns.parameter_3.props.placeholder = placeholders && placeholders.parameter_3 || '';
                });
            },

            saveFinancialSituation() {
                let saveData = {
                    ...this.$refs.financialSituation.formData, insurance_contract_id: this.contractId,
                    client_snapshot_id: this.clientSnapshotId,
                    financialCostsTableData: this.data.financialCostsTable,
                    financialCreditsTableData: this.data.financialCreditsTable,
                    financialIncomesTableData: this.data.financialIncomesTable,
                    spousePropertiesTableData: this.data.spousePropertiesTable,
                };

                axios.post(route('inwork.contracts.questionnaires.saveFinancialSituationData'), saveData)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);

                        this.$emit('on-save', data);
                    })
                    .catch((error) => {
                        this.errorHandler(error, { refForm: this.$refs.financialSituation });
                    });
            },

            checkRequiredValue(tableName, fieldName, comparableId) {
                this.$nextTick(() => {
                    let disabled;

                    if (this.data[`${tableName}Table`].length === 0) {
                        disabled = true;
                    } else {
                        disabled = !this.data[`${tableName}Table`].some((row) => row[fieldName] === comparableId);
                    }

                    this.$refs[tableName].getRowToAdd(fieldName).value = disabled ? comparableId : null;
                    this[`${tableName}Template`].columns[fieldName].disabled = disabled;
                });
            },

            displayPreviousWork() {
                if (!this.contractCreatedAt || !this.$refs.financialSituation.field('work_begin_date')) return;

                const workBeginDate = this.getParseDate(this.$refs.financialSituation.formData.work_begin_date);
                workBeginDate.setFullYear(workBeginDate.getFullYear() - 1);

                const hiddenPreviousWork = workBeginDate > this.getParseDate(this.contractCreatedAt);
                this.$refs.financialSituation.field('previous_work_company_name').meta.hidden = hiddenPreviousWork;
                this.$refs.financialSituation.field('previous_work_company_position').meta.hidden = hiddenPreviousWork;
                this.$refs.financialSituation.field('previous_work_experience').meta.hidden = hiddenPreviousWork;
            },

            getParseDate(date) {
                const [day, month, year] = date.split('.');
                return new Date(year, month - 1, day);
            },
        },
    }
</script>

<style lang="sass">
=placeholder
    &::-webkit-input-placeholder
        @content
    &:-moz-placeholder
        @content
    &::-moz-placeholder
        @content
    &:-ms-input-placeholder
        @content


.financial
    &__block
        .label
            font-size: .8rem
        .utable
            margin-bottom: 2.25rem
            &__rowtoadd
                .input
                    +placeholder
                        color: rgba(#363636, .6)

        .title
            &:not(:last-child)
                margin-bottom: 1.15rem
            &.is-5
                font-size: 1.15rem
        .field
            &:not(:last-of-type)
                margin-bottom: 0
</style>
