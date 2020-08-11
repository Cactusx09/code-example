<template>
<div v-if="productsData.productsTable.length > 0">
    <div class="consultation__parameters_products">
        <div class="consultation__parameters_list has-margin-top-large">
            <h3 class="title is-5">
                {{ i18n('Perelik produktiv') }}
            </h3>

            <u-table
                :template.sync="productsTableTemplate"
                :table.sync="productsData.productsTable"
                :scroll="10"
                ref="productsData">
                <template #calculations="{ row, index }">
                    <div @click="
                            $refs.productsData.hasScroll
                                ? setDropdownPosition($refs.productsData.$el.querySelector('.table-body'), $event.target.closest('.vue-select'))
                                : null"
                        class="column is-paddingless">
                        <vue-select
                            v-model="row.selectData.value"
                            :options="row.selectData.options"
                            @select="setExtraParams({
                                extraRow: row,
                                disabled: false,
                                activeRowIndex: index,
                                sourceName: 'productsData',
                            })"
                            @deselect="extraParams = {
                                rows: null,
                                disabled: false,
                            }"
                            :placeholder="i18n('Oberit produkt')"/>
                    </div>
                </template>
                <template #actions="{ row, index }">
                    <a
                        class="button is-small is-table-button is-info"
                        :disabled="row.selectData.value === null"
                        @click="setExtraParams({
                            extraRow: row,
                            disabled: false,
                            activeRowIndex: index,
                            sourceName: 'productsData',
                        })">
                        <span class="icon is-small">
                            <fa icon="plus"/>
                        </span>
                    </a>
                </template>
            </u-table>
        </div>

        <params
            v-show="extraParams.rows.length > 0"
            :extra-params="extraParams"
            :add-confirmation="typeData.stateAlias === 'insurance'"
            @add-product="addProduct($event)"
            @recalculate="recalculateProducts($event)"
            @test-logics="testInsuranceLogics($event)"
            @close="
                extraParams.rows = [];
                $refs.productsData.setActiveRow();
                $refs.selectedProductsData.setActiveRow();
            "
            ref="extra"/>

        <div
            v-show="typeData.stateAlias !== 'insurance'"
            v-if="selectedProductsData.productsTable.length > 0"
            class="consultation__parameters_choosed">
            <h3 class="title is-5">
                {{ i18n('Obrani produkty') }}
            </h3>

            <u-table
                :template="selectedProductsTableTemplate"
                :table.sync="selectedProductsData.productsTable"
                :scroll="5"
                ref="selectedProductsData">
                <template #selectedCalculations="{ row }">
                    <div class="tag has-margin-bottom-medium">
                        {{ concatFieldsString(row.fields.select, row.productRecalcObject) }}
                    </div>
                </template>
                <template #actions="{ row, index }">
                    <button
                        @click="setExtraParams({
                            extraRow: row,
                            disabled: true,
                            activeRowIndex: index,
                            sourceName: 'selectedProductsData',
                        })"
                        :class="[{ 'is-active is-focused': extraParams && row.dtRowId === extraParams.dtRowId }, 'button is-small is-table-button is-info']">
                        <span class="icon is-small">
                            <fa icon="info" />
                        </span>
                    </button>
                </template>
            </u-table>
        </div>
    </div>

    <div
        v-if="selectedProductsData.productsTable.length > 0 && typeData.stateAlias !== 'insurance'"
        class="product__buttons level-right has-margin-top-medium has-margin-bottom-large">
        <button
            class="button is-medium is-success"
            @click="saveProducts()">
            {{ i18n('Zberehty' )}}
        </button>
    </div>
</div>
</template>

<script>
    import Params from '@components/cards/parameters/ExtraParams'
    import { VueSelect } from '@enso-ui/select/bulma'
    import UTable from '@components/UTable'

    import Type1TableTemplates from '@templates/parametersCard/Type1Tables.js'

    import concatFieldsString from '@components/mixins/concatFieldsString'

    import errorHandler from '@components/mixins/errorHandler'
    import dropdownPosition from '@components/mixins/dropdownPosition'

    export default {
        components: {
            Params,
            VueSelect,
            UTable,
        },

        mixins: [
            Type1TableTemplates,
            concatFieldsString,
            errorHandler,
            dropdownPosition,
        ],

        inject: ['i18n'],

        props: {
            insuranceProgramParamsData: {
                type: Object,
            },
            stateId: {
                type: Object,
            },
            typeData: {
                type: Object,
            },
        },

        data() {
            return {
                productsData: {
                    productsTable: [],
                },

                extraParams: {
                    rows: [],
                    disabled: false,
                },

                selectedProductsData: {
                    productsTable: [],
                },

                productTypeData: this.typeData,
            }
        },

        created() {
            this.getInsuranceProducts();
        },

        methods: {
            getInsuranceProducts() {
                const requestData = this.getRequestData();

                axios.post(route(this.typeData.apiRoutes.suggestProducts), requestData)
                    .then(({ data }) => {
                        this.buildDataFromResponse(data);
                    })
                    .catch((error) => {
                        const { response: { data } } = error;
                        if (data.status === 'incompleteContextError') {
                            this.$toastr.error(data.message);

                            Object.values(data.errors).forEach((error) => {
                                Object.entries(error).forEach(([key, message]) => {
                                    Object.values(message).forEach((field) => {
                                        this.$toastr.error(`${key}: ${field}`);
                                    });
                                });
                            });
                        } else {
                            this.errorHandler(error);
                        }
                    });
            },
            buildDataFromResponse(data) {
                if (data.status === 'prolongationRequired') {
                    this.$emit('prolongation-required', data.message);
                }

                this.$emit('loaded', data.productsTable);

                if (data.productsTable.length === 0) {
                    this.$toastr.error(this.i18n('Po zadanykh parametrakh poshuku produkt ne znaydeno'));
                    return;
                }

                this.productsData = Object.assign({}, data);

                this.productsData.productsTable.forEach((row, index) => {
                    const options = this.generateOptions(row.calculations, index);

                    this.$set(row, 'selectData', {
                        value: options.length === 1 ? options[0].id : null,
                        options: options,
                    });

                    if (row.product_is_quoted) row.customClass = 'red';
                });

                const label = this.concatFieldsString(this.productsData.fields.select, this.productsData.fields.select);
                this.productsTableTemplate.columns.calculations.label = label;

                // this.selectedProductsTableTemplate.columns.selectedCalculations.label = label;
            },

            generateOptions(calculations, productsRowIndex) {
                let options = [];

                const selectFieldsTemplate = this.productsData.fields.select;

                calculations.forEach((calculationsItem, index) => {
                    options[index] = {
                        id: calculationsItem.recalculatable_id,
                        name: this.concatFieldsString(selectFieldsTemplate, calculationsItem),
                    };
                });

                return options;
            },

            setExtraParams({ extraRow, disabled, activeRowIndex, sourceName }) {
                let extraRowClone = _.cloneDeep(extraRow);
                extraRowClone.calculations = extraRowClone.calculations.filter((item) => item.recalculatable_id === extraRowClone.selectData.value);

                this.extraParams.rows = [{
                    ...extraRowClone,
                    fields: this.productsData.fields,
                }];
                this.extraParams.disabled = disabled;

                this.$nextTick(() => this.$refs.extra.update());

                if (sourceName === 'productsData') {
                    this.$refs.productsData.setActiveRow(activeRowIndex);
                    this.$refs.selectedProductsData.setActiveRow();
                } else {
                    this.$refs.selectedProductsData.setActiveRow(activeRowIndex);
                    this.$refs.productsData.setActiveRow();
                }
                this.$emit('set-extra-params');
            },

            addProduct(extraParams) {
                let newRow = extraParams.rows[0];

                this.extraParams.rows = [];

                newRow.recalculatable_id = newRow.productRecalcObject.recalculatable_id;

                this.selectedProductsData.productsTable.push(newRow);

                let label = this.concatFieldsString(this.productsData.fields.select, this.productsData.fields.select)
                this.selectedProductsTableTemplate.columns.selectedCalculations.label = label;

                if (this.typeData.stateAlias === 'insurance') {
                    this.saveProducts();
                }

                this.$refs.productsData.setActiveRow();
                this.$emit('add-product');
            },

            recalculateProducts(extraParamsData) {
                let requestData = this.getRequestData();
                requestData.calculations = extraParamsData.rows.map((row) => row.productRecalcObject);

                axios.post(route(this.typeData.apiRoutes.recalculate), requestData)
                    .then(({ data }) => {
                        for (let key in data[0]) {
                            if (key !== 'recalc_fields') {
                                this.extraParams.rows[0].productRecalcObject[key] = data[0][key];
                            }
                        }

                        this.$toastr.success(this.i18n('Parametry produktu pererakhovano!'));
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
            testInsuranceLogics(extraParamsData) {
                let requestData = this.getRequestData();
                requestData.calculations = extraParamsData.rows.map((row) => row.productRecalcObject);

                axios.post(route(this.typeData.apiRoutes.testInsuranceLogic), requestData)
                    .then(({ data }) => {

                        data.forEach((insuranceLogic) => {
                            let query = insuranceLogic.locals;
                            query.insurance_reference = insuranceLogic.insurance_reference;

                            const routeData = this.$router.resolve({
                                name: 'administration.insuranceLogics.edit',
                                query: query,
                                params: {
                                    insuranceLogic: insuranceLogic.insurance_logic_id,
                                },
                            });
                            window.open(routeData.href, '_blank');
                        });

                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            saveProducts() {
                let requestData = this.getRequestData();
                requestData.calculations = this.selectedProductsData.productsTable.map((row) => [row.productRecalcObject]);

                axios.post(route(this.typeData.apiRoutes.saveProductData), requestData)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);

                        this.$emit('saved', data);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            getRequestData() {
                const fields = this.insuranceProgramParamsData.fields;

                return {
                    [this.stateId.name]: this.stateId.id,
                    product_type_id: fields.header.product_type_id,
                    product_subtype_id: fields.header.product_subtype_id,
                    insurance_program_id: fields.header.insurance_program_id,
                    insurance_company_id: fields.header.insurance_company_id,
                    searchConditions: fields,
                };
            },
        },
    }
</script>

<style lang="sass">
</style>
