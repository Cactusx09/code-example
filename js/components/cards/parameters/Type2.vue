<template>
<div
    v-if="productsData.productsTable.length > 0"
    class="parameters_products">

    <div
        class="consultation__parameters_products">
        <div class="consultation__parameters_list">
            <h3 class="title is-5">
                {{ i18n('Perelik produktiv') }}
            </h3>

            <u-table
                :template="productsTableTemplate"
                :table.sync="productsData.productsTable"
                :scroll="5"
                class="parameters_products__product"
                ref="productsData">
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
                <template #product_rate="{ row }">
                    <div @click="setDropdownPosition($refs.productsData.$el.querySelector('.table-body'), $event.target.closest('.vue-select'))"
                        class="column is-paddingless">
                        <vue-select
                            v-model="row.product_rate"
                            @input="
                                extraParams.rows = [];
                                $refs.productsData.setActiveRow();
                            "
                            :options="row.productRateOptions"
                            :i18n="i18n"
                            class="has-margin-bottom-medium"/>

                        <div v-if="row.product_rate !== null" class="tags">
                            <span class="tag is-spacebetween">
                                <span v-if="row.totalRewardSum"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Vartist strakhovky')}, ${i18n('hrn')}` }}</span>
                                    <b>{{ row.totalRewardSum }}</b>
                                </span>
                                <span class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Pershyy vnesok')}, ${i18n('hrn')}` }}</span>
                                    <b>{{ row.calculations[row.product_rate].total_credit_prepayment }}</b>
                                </span>
                                <span class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Summa kredytu')}, ${i18n('hrn')}` }}</span>
                                    <b>{{ row.calculations[row.product_rate].total_credit_amount }}</b>
                                </span>
                            </span>
                        </div>
                    </div>
                </template>

                <template #parameters="{ row }">
                    <div class="tags">
                        <span class="tag is-spacebetween">
                            <template v-if="row.product_rate !== null">
                                <span v-if="row.calculations[row.product_rate].monthly_bank_commission_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Komisiya shchomisyatsya')}, %` }}</span>
                                    <b>{{ row.calculations[row.product_rate].monthly_bank_commission_rate }}</b>
                                </span>

                                <span v-if="row.calculations[row.product_rate].credit_offer_commission_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Razova komisiya')}, %` }}</span>
                                    <b>{{ row.calculations[row.product_rate].credit_offer_commission_rate }}</b>
                                </span>

                                <span v-if="row.calculations[row.product_rate].commission_other_amount"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Dod. vytraty')}, ${i18n('hrn')}` }}</span>
                                    <b>{{ row.calculations[row.product_rate].commission_other_amount }}</b>
                                </span>
                                <span v-if="row.calculations[row.product_rate].credit_commission_other_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Dod. vytraty')}, %` }}</span>
                                    <b>{{ row.calculations[row.product_rate].credit_commission_other_rate }}</b>
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
                    <div class="columns parameters_products__product_linkedHead">
                        <div
                            v-for="(column, index) in linkedProductsTableTemplate.columns" :key="index"
                            :class="['column', column.class, column.align ? linkedProductsTableTemplate.aligns[column.align] : linkedProductsTableTemplate.align]">
                            <div class="level">
                                <span>{{ i18n(column.label) }}</span>
                            </div>
                        </div>
                    </div>
                </template>
                <template #linkedProducts="{ row: productsTableRow, index: productsTableIndex }">
                    <u-table
                        :template.sync="linkedProductsTableTemplate"
                        :table.sync="productsTableRow.linkedProducts"
                        :scroll="false"
                        class="parameters_products__product_linkedTable">
                        <template #thead><div></div></template>
                        <template #calculations="{ row: linkedProductsRow, index: linkedProductsIndex }">
                            <div @click="setDropdownPosition()"
                                class="column is-7-fullhd is-7-widescreen is-12-desktop is-6-tablet is-12-mobile is-paddingless">
                                <vue-select
                                    v-model="linkedProductsRow.productSelectData.value"
                                    :options="linkedProductsRow.productSelectData.options"
                                    @input="
                                        generateOptions($event, linkedProductsRow, productsTableIndex, linkedProductsIndex);
                                        productHasEmptySelect(productsTableRow);
                                        extraParams.rows = [];
                                        $refs.productsData.setActiveRow();
                                    "
                                    :i18n="i18n"
                                    class="has-padding-right-medium"
                                    :placeholder="i18n('Oberit produkt')"/>
                            </div>
                            <div @click="setDropdownPosition()"
                                class="column is-5-fullhd is-5-widescreen is-12-desktop is-6-tablet is-12-mobile is-paddingless">
                                <vue-select
                                    v-model="linkedProductsRow.selectData.value"
                                    :options="linkedProductsRow.selectData.options"
                                    :i18n="i18n"
                                    @input="
                                        productHasEmptySelect(productsTableRow);
                                        setInsuranceCostSum(productsTableRow);
                                        extraParams.rows = [];
                                        $refs.productsData.setActiveRow();
                                    "
                                    :labels="{
                                        select: 'select',
                                        deselect: 'deselect',
                                        noOptions: 'Ne znaydeno. Zminit parametry poshuku',
                                        noResults: 'No search results found',
                                        addTag: 'Add option',
                                        search: 'Search...',
                                    }"
                                    :disabled="linkedProductsRow.productSelectData.value === null"
                                    :class="[
                                        'has-padding-left-medium',
                                        linkedProductsRow.selectData.options.length > 0 ? 'calculation-select' : 'calculation-error-select',
                                    ]"
                                    :placeholder="i18n('Oberit parametry')"/>
                            </div>
                        </template>
                    </u-table>
                </template>

                <template #actions="{ row, index }">
                    <button
                        :disabled="row.product_rate === null || row.disabledInfoButton"
                        @click="setExtraParams({
                            extraRow: row,
                            disabled: false,
                            activeRowIndex: index,
                            sourceName: 'productsData',
                        })"
                        class="button is-small is-table-button is-info">
                        <span class="icon is-small">
                            <fa icon="plus"/>
                        </span>
                    </button>
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
            v-show="selectedProductsData.productsTable.length > 0"
            class="consultation__parameters_choosed">
            <h3 class="title is-5">
                {{ i18n('Obrani produkty') }}
            </h3>

            <u-table
                :template="selectedProductsTableTemplate"
                :table.sync="selectedProductsData.productsTable"
                :scroll="5"
                class="parameters_products__selected2"
                ref="selectedProductsData">
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
                    <span class="tag is-medium has-margin-bottom-medium" style="width: 100%">{{ row.productRateString }}</span>
                    <div v-if="row.product_rate !== null" class="tags">
                        <span class="tag is-spacebetween">
                            <span v-if="row.totalRewardSum"
                                class="tag-spacebetween-item">
                                <span>{{ `${i18n('Vartist strakhovky')}, ${i18n('hrn')}` }}</span>
                                <b>{{ row.totalRewardSum }}</b>
                            </span>
                            <span class="tag-spacebetween-item">
                                <span>{{ `${i18n('Pershyy vnesok')}, ${i18n('hrn')}` }}</span>
                                <b>{{ row.calculations[row.product_rate].total_credit_prepayment }}</b>
                            </span>
                            <span class="tag-spacebetween-item">
                                <span>{{ `${i18n('Summa kredytu')}, ${i18n('hrn')}` }}</span>
                                <b>{{ row.calculations[row.product_rate].total_credit_amount }}</b>
                            </span>
                        </span>
                    </div>
                </template>

                <template #parameters="{ row }">
                    <div class="tags">
                        <span class="tag is-spacebetween">
                            <template v-if="row.product_rate !== null">
                                <span v-if="row.calculations[row.product_rate].monthly_bank_commission_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Komisiya shchomisyatsya')}, %` }}</span>
                                    <b>{{ row.calculations[row.product_rate].monthly_bank_commission_rate }}</b>
                                </span>

                                <span v-if="row.calculations[row.product_rate].credit_offer_commission_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Razova komisiya')}, %` }}</span>
                                    <b>{{ row.calculations[row.product_rate].credit_offer_commission_rate }}</b>
                                </span>

                                <span v-if="row.calculations[row.product_rate].commission_other_amount"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Dod. vytraty')}, ${i18n('hrn')}` }}</span>
                                    <b>{{ row.calculations[row.product_rate].commission_other_amount }}</b>
                                </span>
                                <span v-if="row.calculations[row.product_rate].credit_commission_other_rate"
                                    class="tag-spacebetween-item">
                                    <span>{{ `${i18n('Dod. vytraty')}, %` }}</span>
                                    <b>{{ row.calculations[row.product_rate].credit_commission_other_rate }}</b>
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
                    <div class="columns parameters_products__product_linkedHead">
                        <div
                            v-for="(column, key) in selectedLinkedProductsTableTemplate.columns" :key="key"
                            :class="[
                                'column',
                                column.class,
                                column.align ? selectedLinkedProductsTableTemplate.aligns[column.align] : selectedLinkedProductsTableTemplate.align
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
                        class="parameters_products__product_linkedTable">
                        <template #thead><div></div></template>
                        <template #selectedCalculations="{ row }">
                            <div class="tags">
                                <div class="tag is-spacebetween">
                                    <div class="tag-spacebetween-item">
                                        <span>{{ row.productRecalcObject.product_code }} - {{ row.productRecalcObject.product_name }}</span>
                                        <b>{{ concatFieldsString(row.fields.select, row.productRecalcObject) }}</b>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </u-table>
                </template>

                <template #actions="{ row, index }">
                    <button @click="setExtraParams({
                            extraRow: row,
                            disabled: true,
                            activeRowIndex: index,
                            sourceName: 'selectedProductsData',
                        })"
                        class="button is-small is-table-button is-info">
                        <span class="icon is-small">
                            <fa icon="info" />
                        </span>
                    </button>
                </template>
            </u-table>
        </div>
    </div>

    <div v-if="selectedProductsData.productsTable.length > 0"
        class="product__buttons level-right has-margin-top-medium has-margin-bottom-large">
        <button @click="saveProducts()"
            class="button is-medium is-success">
            {{ i18n('Zberehty') }}
        </button>
    </div>
</div>
</template>

<script>
    import Params from '@components/cards/parameters/ExtraParams'
    import { VueSelect } from '@enso-ui/select/bulma'
    import UTable from '@components/UTable'
    import { VTooltip } from 'v-tooltip'

    import Type2TablesTemplate from '@templates/parametersCard/Type2Tables.js'

    import concatFieldsString from '@components/mixins/concatFieldsString'

    import errorHandler from '@components/mixins/errorHandler'
    import dropdownPosition from '@components/mixins/dropdownPosition'

    export default {
        directives: { tooltip: VTooltip },

        components: {
            Params,
            VueSelect,
            UTable,
        },

        mixins: [
            Type2TablesTemplate,
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
                    inited: false,
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
                this.$emit('loaded', data.productsTable);

                if (data.productsTable.length === 0) {
                    this.$toastr.error('По заданих параметрах пошуку продукт не знайдено.');
                    return;
                }

                this.productsData = Object.assign({}, data);

                this.productsData.productsTable.forEach((productRow, productIndex) => {

                    productRow.productRateOptions = productRow.calculations.map((item, index) => ({
                        id: index,
                        name: this.concatFieldsString(this.productsData.fields.select, item),
                    }));

                    this.$set(productRow, 'product_rate', productRow.productRateOptions.length === 1 ? productRow.productRateOptions[0].id : null);

                    productRow.linkedProducts.forEach((linkedRow, linkedIndex) => {
                        const options = linkedRow.productsTable.map((product) => ({
                            id: product.dtRowId,
                            name: product.product_name,
                        }));

                        linkedRow.productSelectData = {
                            value: options.length === 1 ? options[0].id : null,
                            options: options,
                        };

                        this.generateOptions(linkedRow.productSelectData.value, linkedRow, productIndex, linkedIndex);
                    });

                    this.productHasEmptySelect(productRow);

                    if (productRow.product_is_quoted) productRow.customClass = 'red';
                });
            },

            generateOptions(productOptionId, linkedRow, productsRowIndex, linkedRowIndex) {
                let options = [];

                if (productOptionId) {
                    const { calculations } = linkedRow.productsTable.find((item) => item.dtRowId === productOptionId);
                    const fields = linkedRow.fields.select;

                    options = calculations
                        .sort((a, b) =>
                            Object.keys(fields).reduce((result, key) =>
                                (result === 0 ? a[key] - b[key] : result),
                                (a.total_reward - b.total_reward) || 0
                            )
                        )
                        .map((calculationItem) => ({
                            id: calculationItem.recalculatable_id,
                            name: this.concatFieldsString(fields, calculationItem),
                            totalReward: calculationItem.total_reward,
                        }))
                }

                this.$set(linkedRow, 'selectData', {
                    options: options,
                    value: options.length > 0 ? options[0].id : null,
                });

                this.setInsuranceCostSum(this.productsData.productsTable[productsRowIndex]);

                return options;
            },
            setInsuranceCostSum(row) {
                let totalRewardSum = 0;
                row.linkedProducts.forEach((linkedRow) => {
                    if (linkedRow.selectData && linkedRow.selectData.value) {
                        totalRewardSum += linkedRow.selectData.options.find((option) => option.id === linkedRow.selectData.value).totalReward;
                    }
                });

                row.totalRewardSum = totalRewardSum.toFixed(2);
            },

            productHasEmptySelect(row) {
                row.disabledInfoButton = row.linkedProducts.some((linkedProduct) => linkedProduct.selectData.value === null || linkedProduct.productSelectData.value === null);
            },

            prepareCalculations(calculations) {
                const primaryRecalc = calculations[0].productRecalcObject.recalc_fields;

                return calculations.map((row) => {
                    const { productRecalcObject } = row;

                    if (primaryRecalc.is_kasko_bank_on_credit != null)
                        productRecalcObject.recalc_fields.is_kasko_bank_on_credit = primaryRecalc.is_kasko_bank_on_credit;
                    if (primaryRecalc.is_incident_bank_on_credit != null)
                        productRecalcObject.recalc_fields.is_incident_bank_on_credit = primaryRecalc.is_incident_bank_on_credit;

                    return productRecalcObject;
                });
            },

            recalculateProducts(extraParamsData) {
                let requestData = this.getRequestData();
                requestData.calculations = this.prepareCalculations(extraParamsData.rows);

                axios.post(route(this.typeData.apiRoutes.recalculate), requestData)
                    .then(({ data }) => {
                        let totalRewardSum = 0;
                        data.forEach((row, index) => {
                            for (let key in row) {
                                if (key !== 'recalc_fields') {
                                    this.extraParams.rows[index].productRecalcObject[key] = row[key];
                                }
                            }
                            totalRewardSum += row.total_reward || 0;
                        });
                        this.extraParams.parentRow.totalRewardSum = totalRewardSum;

                        this.$toastr.success(this.i18n('Parametry produktu pererakhovano!'));
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            setExtraParams({ extraRow, disabled, activeRowIndex, sourceName }) {
                const extraRowCopy = _.cloneDeep(extraRow);

                const setSwitchersVisibility = (() => {
                    if (extraRowCopy.insurance_credit === 'Ni') {
                        delete this.productsData.fields.recalc.is_kasko_bank_on_credit;
                        delete this.productsData.fields.recalc.is_incident_bank_on_credit;
                    } else {
                        const productSubtypesArr = extraRow.linkedProducts.map(row => row.product_subtype_alias);
                        if (!productSubtypesArr.includes('vehicleKaskoBank')) {
                            delete this.productsData.fields.recalc.is_kasko_bank_on_credit;
                        }
                        if (!productSubtypesArr.includes('personalIncidentBank')) {
                            delete this.productsData.fields.recalc.is_incident_bank_on_credit;
                        }
                    }
                })();

                this.extraParams = {
                    rows: extraRowCopy.linkedProducts,
                    parentRow: extraRowCopy,
                    creditProductFields: this.productsData.fields,
                    disabled: disabled,
                };

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
                let newRow = extraParams.parentRow;

                const creditRow = extraParams.rows[0];
                extraParams.rows.shift();

                newRow.productRateString = this.concatFieldsString(creditRow.fields.select, creditRow.productRecalcObject);
                newRow.productRecalcObject = creditRow.productRecalcObject;

                this.selectedProductsData.productsTable.push(newRow);

                this.extraParams.rows = [];

                if (this.typeData.stateAlias === 'insurance') {
                    this.saveProducts();
                }

                this.$emit('add-product');
            },

            testInsuranceLogics(extraParamsData) {
                let requestData = this.getRequestData();

                requestData.calculations = this.prepareCalculations(extraParamsData.rows);
                requestData.calculations = extraParamsData.rows.map((row) => row.productRecalcObject);

                const selectedProductRowCalculation = extraParamsData.parentRow.calculations[extraParamsData.parentRow['product_rate']];
                requestData.calculations.unshift(selectedProductRowCalculation);

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
                const calculations = this.selectedProductsData.productsTable.map((productRow) => {
                    const { productRecalcObject, linkedProducts } = productRow;
                    return this.prepareCalculations([{ productRecalcObject }, ...linkedProducts]);
                });

                const requestData = { calculations, ...this.getRequestData() };

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

                const data = {
                    [this.stateId.name]: this.stateId.id,
                    product_type_id: fields.header.product_type_id,
                    product_subtype_id: fields.header.product_subtype_id,
                    insurance_company_id: fields.header.insurance_company_id,
                    searchConditions: fields,
                };

                if (fields.header.insurance_program_id) data.insurance_program_id = fields.header.insurance_program_id;
                return data;
            },
        },
    }
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"

.parameters_products
    &__selected2,
    &__product
        .utable-tr.is-active
            border-left: 1px solid #209cee
            .column_linkedProducts
                .utable-tr
                    color: #209cee
                    font-weight: 700
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
                    +desktop-only
                        flex-direction: column
                        align-items: flex-start
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

        .dropdown.vue-select .dropdown-trigger .button.input, .control, .input
            // font-size: 0.8rem
        .vue-select
            .button
                // font-size: 0.7rem
                .control
                    font-size: 0.9rem
                // .is-small.delete
                //     height: 12px
                //     max-height: 12px
                //     max-width: 12px
                //     min-height: 12px
                //     min-width: 12px
                //     width: 12px
                // .dropdown.vue-select
                //     .dropdown-trigger .button.input .control-display .delete
                //         top: 0.45rem

        .utable-td
            .column_bank
                flex-direction: column
                align-items: flex-start
                justify-content: center
                .icon
                    margin-bottom: -1px
                .level
                    margin-bottom: 0
        .utable-td,
        .utable-th
            +tablet-only
                margin-left: -1px
        .column
            &_product_rate
                +mobile
                    &::before
                        width: 100%
            &_linkedProducts
                padding: 0
                align-items: stretch
                // width: 100%
                flex-grow: 2
                +desktop-only
                    .has-padding-left-medium
                        padding-left: 0
                    .has-padding-right-medium
                        padding-right: 0
                // +mobile
                //     .tag
                //         width: 100%
                +mobile
                    &::before
                        margin-left: 0.5rem
                        margin-top: 0.25rem
                .columns
                    margin: 0
                    .column
                        &:last-of-type
                            border-right: none
            &_calculations
                max-width: 100%
                .vue-select
                    &:not(:last-of-type)
                        margin-bottom: .2rem
                +mobile
                    &::before
                        display: none
            // &.actions
            //     max-width: 70px

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
                        border: none
                        width: 100%
                        &:not(.utable__rowtoadd):hover
                            background: none
                        &:not(:last-of-type)
                            border-bottom: 1px solid #dbdbdb

                +mobile
                    .has-padding-left-medium
                        padding-left: 0
                        padding-bottom: 0.25rem
                    .has-padding-right-medium
                        padding-right: 0
                        padding-bottom: 0.25rem
                        padding-top: 0.25rem

                .tag
                    height: auto

</style>
