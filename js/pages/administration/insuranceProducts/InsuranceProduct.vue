<template>
    <div>
        <div class="product__parameters">
            <div class="columns">
                <div class="column field is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                    <label class="label">{{ i18n('Napravlennya') }}</label>
                    <vue-select v-model="product_class_id"
                        :source="route('administration.productClasses.selectOptions')"
                        @deselect="product_type_id = null; product_subtype_id = null; insurance_program_id = null"
                        @clear="product_type_id = null; product_subtype_id = null; insurance_program_id = null"
                        :placeholder="i18n('Vyberit napravlennya')" />
                </div>
                <div v-if="product_class_id" class="column field is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                    <label class="label">{{ i18n('Typ produktu') }}</label>
                    <vue-select v-model="product_type_id"
                        :source="route('administration.productTypes.selectOptions')"
                        :pivot-params="productTypeParams"
                        :disabled="!product_class_id"
                        @deselect="product_subtype_id = null; insurance_program_id = null"
                        @clear="product_subtype_id = null; insurance_program_id = null"
                        :placeholder="i18n('Vyberit typ produktu')" />
                </div>
                <div v-if="product_type_id && product_class_id"
                    class="column field is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                    <label class="label">{{ i18n('Pidtyp produktu') }}</label>
                    <vue-select v-model="product_subtype_id"
                        :source="route('administration.productSubtypes.selectOptions')"
                        :pivot-params="productSubTypeParams"
                        :disabled="!product_type_id"
                        @deselect="insurance_program_id = null"
                        @clear="insurance_program_id = null"
                        @selection="setBlocksProductType($event)"
                        :placeholder="i18n('Vyberit pidtyp produktu')" />
                </div>
                <div v-if="product_subtype_id && product_type_id && product_class_id"
                    class="column field is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                    <label class="label">{{ i18n('Prohrama strakhuvannya') }}</label>
                    <vue-select v-model="insurance_program_id"
                        :source="route('administration.insurancePrograms.selectOptions')"
                        :pivot-params="insuranceProgramParams"
                        :disabled="!product_subtype_id"
                        :placeholder="i18n('Vyberit prohramu')" />
                </div>
            </div>

            <div class="columns">
                <div class="column field is-3-fullhd is-4-widescreen is-4-desktop is-6-tablet is-12-mobile">
                    <element-validation :label='`Strakhova kompaniya`'
                        :name="`insurance_company_id`"
                        :errors="errors">
                        <vue-select v-model="insurance_company_id"
                            :source="route('administration.agencies.selectInsuranceCompanies')"
                            disable-clear
                            :placeholder="i18n('Vyberit strakhovu kompaniyu')"
                            :has-error="errors.has('insurance_company_id')"
                            @input="errors.clear('insurance_company_id')"/>
                    </element-validation>
                </div>
            </div>
            <div class="columns">
                <div class="column field is-3-fullhd is-4-widescreen is-3-desktop is-6-tablet is-12-mobile">
                    <ElementValidation v-model="product_code"
                        :label='`Kod`'
                        :name="`product_code`"
                        placeholder="Vvedit kod"
                        :errors="errors"/>
                </div>
                <div class="column field is-3-fullhd is-4-widescreen is-6-desktop is-6-tablet is-12-mobile">
                    <ElementValidation v-model="product_name"
                        :label='`Nazva produktu`'
                        placeholder="Vvedit nazvu produktu"
                        :name="`product_name`"
                        :errors="errors"/>
                </div>

                <div v-if="blocks.credit" class="column field is-3-fullhd is-4-widescreen is-6-desktop is-6-tablet is-12-mobile">
                    <ElementValidation v-model="product_credit_bank_name"
                        :label='`Bankivska nazva`'
                        :name="`product_credit_bank_name`"
                        placeholder="Vvedit bankivsku nazvu"
                        :errors="errors"/>
                </div>
            </div>
            <div class="columns">
                <div class="column field is-3-fullhd is-4-widescreen is-3-desktop is-6-tablet is-12-mobile">
                    <ElementValidation v-model="old_id"
                       :label='`Id producta ins1`'
                       placeholder="Vvedit id producta ins1"
                       :name="`product_name`"
                       :errors="errors"/>
                </div>
            </div>
        </div>

        <div v-show="insurance_program_id">
            <div
                v-if="blocks.activation"
                class="product__activation product__block">
                <div class="columns is-vcentered">
                    <div class="product__activation_btn column">
                        <label
                            @click="activity_status = !activity_status"
                            class="title is-6">{{ i18n('Aktyvuvaty produkt') }}</label>
                        <vue-switch
                            v-model="activity_status"
                            size="is-large"
                            type="is-success"/>
                    </div>
                    <div class="column">
                        <datepicker
                            v-model="activity_begin_datetime"
                            :is-danger="errors.has('activity_begin_datetime')"
                            @input="errors.clear('activity_begin_datetime');"
                            time
                            format="d.m.Y H:i"
                            :locale="$store.getters['preferences/lang']"
                            :disabled="!activity_status"
                            :placeholder="i18n('Aktyvuvaty z')"/>
                    </div>
                    <div class="column">
                        <datepicker
                            v-model="activity_end_datetime"
                            :is-danger="errors.has('activity_end_datetime')"
                            @input="errors.clear('activity_end_datetime');"
                            time
                            format="d.m.Y H:i"
                            :locale="$store.getters['preferences/lang']"
                            :disabled="!activity_status"
                            :placeholder="i18n('Aktyvuvaty do')"/>
                    </div>
                </div>
            </div>

            <div v-if="blocks.isBatchOnly || blocks.isNextPeriodOnly"
                class="product__switchers product__block columns">
                <div v-if="blocks.isBatchOnly"
                    class="column is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <vue-switch
                        v-model="is_batch_only"
                        size="is-large"
                        type="is-success"
                        class="has-margin-right-large"/>
                    <label
                        @click="is_batch_only = !is_batch_only"
                        class="title is-6 is-marginless">
                        {{ i18n('Zaboronyty realizatsiyu v yakosti okremoho produktu') }}
                    </label>
                    <span class="icon has-tooltip has-text-info has-margin-left-large"
                        v-tooltip="i18n('Oberit optsiyu, yakshcho potochnyy produkt dozvoleno do prodazhu tilky v skladi paketu')">
                        <fa icon="info-circle"
                            size="lg"/>
                    </span>
                </div>
                <div v-if="blocks.isNextPeriodOnly"
                    class="column is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <vue-switch
                        v-model="is_next_period_only"
                        size="is-large"
                        type="is-success"
                        class="has-margin-right-large"/>
                    <label
                        @click="is_next_period_only = !is_next_period_only"
                        class="title is-6 is-marginless">
                        {{ i18n('Produkt tilky dlya dohovoriv nastupnoho periodu') }}
                    </label>
                    <span class="icon has-tooltip has-text-info has-margin-left-large"
                        v-tooltip="i18n('Oberit optsiyu yakshcho potochnyy produkt zaboroneno dlya prodazhu v pershomu periodu strakhuvannya')">
                        <fa icon="info-circle"
                            size="lg"/>
                    </span>
                </div>
            </div>
            <div v-if="blocks.isAction || blocks.isInsuranceOnCredit || blocks.isOnetimeCommissionOnCredit"
                class="product__switchers product__block columns">
                <div v-if="blocks.isAction"
                    class="column is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile">
                    <vue-switch
                        v-model="is_action"
                        size="is-large"
                        type="is-success"
                        class="has-margin-right-large"/>
                    <label
                        @click="is_action = !is_action"
                        class="title is-6 is-marginless">
                        {{ i18n('Aktsiya') }}
                    </label>
                    <span class="icon has-tooltip has-text-info has-margin-left-large"
                        v-tooltip="i18n('Dlya markuvannya aktsiynykh kredytnykh abo lizynhovykh produktiv')">
                        <fa icon="info-circle"
                            size="lg"/>
                    </span>
                </div>
                <div v-if="blocks.isInsuranceOnCredit"
                    class="column is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile">
                    <vue-switch
                        v-model="is_insurance_on_credit"
                        size="is-large"
                        type="is-success"
                        class="has-margin-right-large"/>
                    <label
                        @click="is_insurance_on_credit = !is_insurance_on_credit"
                        class="title is-6 is-marginless">
                        {{ i18n('Strakhuvannya v kredyt') }}
                    </label>
                    <span class="icon has-tooltip has-text-info has-margin-left-large"
                        v-tooltip="i18n('Oberit optsiyu, yakshcho potochnyy produkt peredbachaye strakhuvannya KASKO ta/abo NV v kredyt')">
                        <fa icon="info-circle"
                            size="lg"/>
                    </span>
                </div>
                <div v-if="blocks.isOnetimeCommissionOnCredit"
                    class="column is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile">
                    <vue-switch
                        v-model="is_onetime_commission_on_credit"
                        size="is-large"
                        type="is-success"
                        class="has-margin-right-large"/>
                    <label
                        @click="is_onetime_commission_on_credit = !is_onetime_commission_on_credit"
                        class="title is-6 is-marginless">
                        {{ i18n('Razova komisiya v kredyt') }}
                    </label>
                    <span class="icon has-tooltip has-text-info has-margin-left-large"
                        v-tooltip="i18n('Oberit optsiyu, yakshcho potochnyy produkt peredbachaye mozhlyvist dodaty razovu komisiyu v tilo kredytu')">
                        <fa icon="info-circle"
                            size="lg"/>
                    </span>
                </div>
            </div>

            <!-- <div v-if="blocks.credit" class="product__block">
                <div class="columns">
                    <div class="column field is-4-fullhd is-6-widescreen is-6-desktop is-10-tablet is-12-mobile">
                        <label class="label">{{ i18n('Valyuta') }}</label>
                        <vue-select v-model="product_currencies"
                            :source="route('references.currencies.selectOptions')"
                            disable-clear
                            multiple
                            :placeholder="i18n('Vyberit valyutu')" />
                    </div>
                    <div class="column field is-4-fullhd is-6-widescreen is-6-desktop is-10-tablet is-12-mobile">
                        <label class="label">{{ i18n('Skhema pohashennya') }}</label>
                        <vue-select v-model="product_credit_repayment_schemas"
                            :source="route('references.creditRepaymentSchemas.selectOptions')"
                            disable-clear
                            :placeholder="i18n('Vyberit skhemu pohashennya')"
                            multiple/>
                    </div>
                </div>
            </div> -->

            <component-validation
                v-if="blocks.paymentLimits"
                class="product__block"
                label="Limit vyplat DSTsV"
                name="productPaymentLimitsTable"
                :errors="errors"
                key="paymentLimits">
                <u-table
                    :template.sync="productPaymentLimitsTemplate"
                    :table.sync="productPaymentLimitsTable"
                    :scroll="false"
                    @add-row="errors.clear('productPaymentLimitsTable')">
                </u-table>
            </component-validation>

            <component-validation
                v-if="blocks.parameters"
                class="product__block"
                label="Parametry produktu"
                name="productParametersTable"
                :errors="errors"
                key="parameters">
                <u-table
                    :template="productParametersTemplate"
                    :table.sync="productParametersTable"
                    :scroll="false">
                    <template #rowToAdd_product_parameter_id="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.product_parameter_id.value"
                            :i18n="i18n"
                            :params="{
                                product_parameter_group_id: rowToAdd.product_parameter_group_id.value,
                            }"
                            @selection="rowToAdd.product_parameter_id.selection = $event"
                            :disabled="!rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>
                </u-table>
            </component-validation>

            <component-validation
                v-if="blocks.creditParameters"
                class="product__block"
                label="Parametry kredytuvannya"
                name="productCreditParametersTable"
                :errors="errors"
                key="creditParameters">
                <u-table
                    :template="productCreditParametersTemplate"
                    :table.sync="productCreditParametersTable"
                    :scroll="false"
                    class="animated"
                    @add-row="errors.clear('productCreditParametersTable')">
                </u-table>
            </component-validation>

            <component-validation
                v-if="blocks.account"
                class="product__block"
                label="Rozrakhunkovyy rakhunok"
                name="productBankAccountTemplate"
                :errors="errors"
                key="account">
                <template>
                    <div class="columns">
                        <div class="column field is-4-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                            <u-search
                                :api-url="route('dynamicsearch.bankAccount.initUBankAccountTable')"
                                @accept="
                                    productBankAccountTable = $event;
                                    errors.clear('productBankAccountTemplate')
                                "
                                :table-search.sync="blocksData.account.keywords"
                                :min-length="3">
                                <div class="control has-icons-left has-icons-right">
                                    <u-input
                                        v-model="blocksData.account.keywords"
                                        type="text"
                                        :disabled="productBankAccountTable.length > 0"
                                        placeholder="Universalnyy poshuk po Nazvi, Rakhunku"/>
                                    <span class="icon is-small is-left">
                                        <fa icon="search"/>
                                    </span>
                                </div>
                            </u-search>
                        </div>
                    </div>

                    <u-table v-if="productBankAccountTable.length > 0"
                        :template.sync="productBankAccountTemplate"
                        :table.sync="productBankAccountTable"
                        :scroll="false">
                    </u-table>
                </template>
            </component-validation>

            <element-validation
                v-if="blocks.description"
                class="product__block"
                :name="`product_description`"
                :errors="errors"
                :key="'description'">
                <template #label>
                    <h3 class="title has-margin-bottom-large">{{ i18n('Opys (Informatsiya dostupna ahentu)') }}</h3>
                </template>
                <textarea v-model="product_description"
                    :key="'product_description'"
                    :placeholder="i18n('Diysnyy dlya') + '...'"
                    :class="['textarea', { 'is-danger': errors.has('product_description') }]"
                    @input="errors.clear('product_description')" />
            </element-validation>

            <element-validation
                v-if="blocks.notice"
                class="product__block product-notice"
                :name="`product_notice`"
                :errors="errors"
                :key="'notice'">
                <template #label>
                    <h3 class="title has-margin-bottom-large">{{ i18n('Prymitky (dlya vykorystannya spetsialistamy bekofis)') }}</h3>
                </template>
                <textarea v-model="product_notice"
                    :key="'product_notice'"
                    placeholder="..."
                    :class="['textarea', { 'is-danger': errors.has('product_notice') }]"
                    @input="errors.clear('product_notice')" />
            </element-validation>

            <component-validation v-if="blocks.brandModel"
                class="product__block"
                :label="`Brend ta model`"
                :name="`productBrandModelsTable`"
                :errors="errors"
                :key="'brandModel'">
                <template #title-right>
                    <div class="column is-5">
                        <vue-select v-model="blocksData.productBrandModels.groupModel"
                            :i18n="i18n"
                            :source="route('administration.brandsGroups.options')"
                            :placeholder="i18n('Vyberit hrupu brendiv')"/>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-success"
                            :disabled="typeof blocksData.productBrandModels.groupModel !== 'number'"
                            @click="getBrandGroups()">
                            {{ i18n('Vybraty') }}
                        </button>
                    </div>
                </template>

                <u-table :template="productBrandModelsTemplate"
                    :table.sync="productBrandModelsTable"
                    :scroll="false"
                    :name="'BrandModels'">
                    <template #rowToAdd_car_model_filter_policy_id="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.car_model_filter_policy_id.value"
                            :i18n="i18n"
                            @selection="selectionBrandModelPolicy($event, rowToAdd)"
                            :disabled="rowToAdd[column.refDisabled] && !rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>

                    <template #rowToAdd_carModels="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.carModels.value"
                            :i18n="i18n"
                            :params="{
                                brand_id:  rowToAdd.car_brand_id.value,
                            }"
                            @selection="rowToAdd.carModels.selection = $event"
                            :disabled="!rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>
                </u-table>
            </component-validation>

            <component-validation v-if="blocks.productNextPeriod"
                class="product__block"
                :label="`Produkt nastupnoho periodu`"
                :name="`productNextPeriodTable`"
                :errors="errors"
                :key="'productNextPeriod'">
                <template>
                    <div class="columns">
                        <div class="column field is-4-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                            <u-search :api-url="'/api/dynamicsearch/insuranceProduct/initProductUTable'"
                                @accept="productNextPeriodTable = uniqBy(productNextPeriodTable, $event);
                                    blocksData.productNextPeriod.keywords = '';
                                    errors.clear('productNextPeriodTable')"
                                @cancel="blocksData.productNextPeriod.keywords = ''"
                                :table-search.sync="blocksData.productNextPeriod.keywords"
                                :min-length="3"
                                checkbox>
                                <div class="control has-icons-left has-icons-right">
                                    <u-input
                                        v-model="blocksData.productNextPeriod.keywords"
                                        type="text"
                                        placeholder="Universalnyy poshuk po nazvi prohramy strakhuvannya, Kodu abo nazvi produktu"
                                    />
                                    <span class="icon is-small is-left">
                                        <fa icon="search" />
                                    </span>
                                </div>
                            </u-search>
                        </div>
                    </div>
                    <u-table v-if="productNextPeriodTable.length > 0"
                        :template="productNextPeriodTemplate"
                        :table.sync="productNextPeriodTable"
                        :scroll="false">
                    </u-table>
                </template>
            </component-validation>

            <component-validation v-if="blocks.basicTariffs"
                class="product__block"
                :label="`Bazovi taryfy`"
                :name="`productBaseRatesTable`"
                :errors="errors"
                :key="'basicTariffs'">
                <template>
                    <div class="columns">
                        <div class="column field is-4-fullhd is-6-widescreen is-6-desktop is-10-tablet is-12-mobile">
                            <div class="label">{{ i18n('Typ TZ') }}</div>
                            <vue-select v-model="blocksData.productBaseRatesTable.product_car_type_id"
                                :source="route('references.productcartypes.selectOptions')"
                                @input="generateTable(blocksData.productBaseRatesTable.product_car_type_id, 'product_car_type_id', 'product_risk_type_id', 'x', 'product_car_type_id2', 'productBaseRates')"
                                @remove="generateTable(blocksData.productBaseRatesTable.product_car_type_id, 'product_car_type_id', 'product_risk_type_id', 'x', 'product_car_type_id2', 'productBaseRates')"
                                multiple
                                ref="product_car_type_id2"
                                :placeholder="i18n('Oberit typy TZ')"/>
                        </div>
                        <div class="column field is-4-fullhd is-6-widescreen is-6-desktop is-10-tablet is-12-mobile">
                            <div class="label">{{ i18n('Vybir ryzykiv') }}</div>
                            <vue-select v-model="blocksData.productBaseRatesTable.product_risk_type_id"
                                :source="route('references.productrisktypes.selectOptions')"
                                @input="generateTable(blocksData.productBaseRatesTable.product_risk_type_id, 'product_risk_type_id', 'product_car_type_id', 'y', 'product_car_type_id2', 'productBaseRates');
                                    errors.clear('productBaseRatesTable')"
                                @remove="generateTable(blocksData.productBaseRatesTable.product_risk_type_id, 'product_risk_type_id', 'product_car_type_id', 'y', 'product_car_type_id2', 'productBaseRates')"
                                :disabled="blocksData.productBaseRatesTable.product_car_type_id.length === 0"
                                multiple
                                ref="product_risk_type_id"
                                :placeholder="i18n('Oberit ryzyky')"/>
                        </div>
                    </div>
                    <u-table v-if="blocksData.productBaseRatesTableConverted.length > 0"
                        :template.sync="blocksData.productBaseRatesTemplate"
                        :table.sync="blocksData.productBaseRatesTableConverted"
                        :scroll="false">
                        <template
                            v-for="(column, key) in blocksData.productBaseRatesTemplate.columns"
                            v-slot:[key]="{ row }">
                            <span :key="key">
                                <u-input
                                    v-if="column.meta.editable"
                                    v-model="row[column.name].value"/>
                                <span v-else>
                                    {{ row[column.name] }}
                                </span>
                            </span>
                        </template>
                    </u-table>
                </template>
            </component-validation>

            <component-validation v-if="blocks.franchise"
                class="product__block product_franchise"
                :label="`Franshyzy`"
                :name="`productFranchisesTable`"
                :errors="errors"
                :key="'franchise'">
                <u-table
                    :template.sync="blocksData.activeFranchiseTemplate"
                    :table.sync="productFranchisesTable"
                    :scroll="false"
                    ref="productFranchiseTable"
                    @add-row="
                        errors.clear('productFranchisesTable');
                        productFranchisesTable[0].other_risk_franchise_type_name = $event.rowToAdd.other_risk_franchise_type_name;
                        productFranchisesTable[0].illegal_ownery_franchise_type_name = $event.rowToAdd.illegal_ownery_franchise_type_name;
                    "
                    @set-default-add="
                        $set($event, 'illegal_ownery_franchise_type_id', 1);
                        $set($event, 'other_risk_franchise_type_id', 1);
                    "
                >
                    <template #thead="{ template }">
                        <div :class="[template.style, 'utable-tr']">
                            <div :class="['column utable-th', template.productType === 'vehicleKasko' ? 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile' : 'is-4-fullhd is-5-widescreen is-3-desktop is-6-tablet is-6-mobile', template.align]">{{ i18n('Typ TZ') }}</div>
                            <div :class="['column utable-th', template.productType === 'vehicleKasko' ? 'is-6-fullhd is-4-widescreen is-4-desktop is-2-tablet is-6-mobile' : 'is-4-fullhd is-4-widescreen is-2-desktop is-2-tablet is-6-mobile', template.align]">{{ i18n('Franshyza') }}</div>
                            <div :class="['column utable-th', template.productType === 'vehicleKasko' ? 'is-2-fullhd is-4-widescreen is-4-desktop is-2-tablet is-6-mobile' : 'is-3-fullhd is-2-widescreen is-2-desktop is-2-tablet is-6-mobile', template.align]">{{ i18n('Koefitsiyent') }}</div>
                            <div :class="[template.align, 'actions column utable-th is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-12-mobile']"></div>
                        </div>
                        <div :class="[template.style, 'utable-tr']">
                            <div :class="['column utable-th', template.productType === 'vehicleKasko' ? 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile' : 'is-4-fullhd is-5-widescreen is-3-desktop is-6-tablet is-6-mobile']"></div>
                            <div :class="['column utable-th', template.productType === 'vehicleKasko' ? 'is-3-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile' : 'is-4-fullhd is-4-widescreen is-3-desktop is-6-tablet is-6-mobile']">{{ i18n('Inshi ryzyky') }}</div>
                            <div v-if="template.productType === 'vehicleKasko'" class="utable-th column is-3-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile">{{ i18n('Nezak. zavol.') }}</div>
                            <div :class="['column utable-th', template.productType === 'vehicleKasko' ? 'is-1-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile' : 'is-3-fullhd is-2-widescreen is-3-desktop is-6-tablet is-6-mobile']">{{ i18n('Inshi ryzyky') }}</div>
                            <div v-if="template.productType === 'vehicleKasko'" class="utable-th column is-1-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile">{{ i18n('Nezak. zavol.') }}</div>
                            <div :class="['column utable-th actions', template.align, 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-12-mobile']"></div>
                        </div>
                    </template>

                    <template #rowToAdd_other_risk_franchise_value="{ rowToAdd, column }">
                        <span
                            class="columns number_type"
                            :data-label="column.label">
                            <span class="column is-6">
                                <u-input
                                    v-model="rowToAdd.other_risk_franchise_value.value"
                                    v-bind="column.numberProps"
                                    :disabled="'boolean' === typeof column.refDisabled ? false : !rowToAdd[column.refDisabled].value"
                                />
                            </span>
                            <span class="column is-6">
                                <vue-select
                                    v-model="rowToAdd.other_risk_franchise_type_id"
                                    @selection="$event ? rowToAdd.other_risk_franchise_type_name = $event.name : ''"
                                    :placeholder="i18n(column.placeholder)"
                                    v-bind="column.selectProps"
                                />
                            </span>
                        </span>
                    </template>
                    <template #rowToAdd_illegal_ownery_franchise_value="{ rowToAdd, column }">
                        <span
                            class="columns number_type"
                            :data-label="column.label">
                            <span class="column is-6">
                                <u-input
                                    v-model="rowToAdd.illegal_ownery_franchise_value.value"
                                    v-bind="column.numberProps"
                                    :disabled="'boolean' === typeof column.refDisabled ? false : !rowToAdd[column.refDisabled].value"
                                />
                            </span>
                            <span class="column is-6">
                                <vue-select
                                    v-model="rowToAdd.illegal_ownery_franchise_type_id"
                                    @selection="$event ? rowToAdd.illegal_ownery_franchise_type_name = $event.name : ''"
                                    :placeholder="i18n(column.placeholder)"
                                    v-bind="column.selectProps"
                                />
                            </span>
                        </span>
                    </template>

                    <template #other_risk_franchise_value="{ row }">
                        {{ `${row.other_risk_franchise_value} ${row.other_risk_franchise_type_name}`}}
                    </template>
                    <template #illegal_ownery_franchise_value="{ row }">
                        {{ `${row.illegal_ownery_franchise_value} ${row.illegal_ownery_franchise_type_name}`}}
                    </template>
                </u-table>
            </component-validation>

            <component-validation v-if="blocks.years"
                class="product__block product_years"
                :label="`Kilkist rokiv`"
                :name="`productNumberYearsTable`"
                :errors="errors"
                :key="'years'">
                <template>
                    <div class="columns">
                        <div class="column field is-4-fullhd is-6-widescreen is-6-desktop is-10-tablet is-12-mobile">
                            <div class="label">{{ i18n('Vuybir roku') }}</div>
                            <vue-select v-model="blocksData.productNumberYearsTable.product_period_id"
                                :source="route('references.productPeriods.selectOptions')"
                                @select="generateTable(blocksData.productNumberYearsTable.product_period_id, 'product_period_id', 'product_car_type_id', 'x', 'product_period_id', 'productNumberYears');
                                    errors.clear('productNumberYearsTable')"
                                @deselect="generateTable(blocksData.productNumberYearsTable.product_period_id, 'product_period_id', 'product_car_type_id', 'x', 'product_period_id', 'productNumberYears')"
                                multiple
                                ref="product_period_id"
                                :placeholder="i18n('Oberit period')"/>
                        </div>
                        <div class="column field is-4-fullhd is-6-widescreen is-6-desktop is-10-tablet is-12-mobile">
                            <div class="label">{{ i18n('Typ TZ') }}</div>
                            <vue-select v-model="blocksData.productNumberYearsTable.product_car_type_id"
                                :source="route('references.productcartypes.selectOptions')"
                                @select="blocksData.productNumberYearsTable.product_period_id.length > 0 ? generateTable(blocksData.productNumberYearsTable.product_car_type_id, 'product_car_type_id', 'product_period_id', 'y', 'product_period_id', 'productNumberYears') : null"
                                @deselect="generateTable(blocksData.productNumberYearsTable.product_car_type_id, 'product_car_type_id', 'product_period_id', 'y', 'product_period_id', 'productNumberYears')"
                                :disabled="blocksData.productNumberYearsTable.product_period_id.length === 0"
                                multiple
                                ref="product_car_type_id"
                                :placeholder="i18n('Oberit typy TZ')"/>
                        </div>
                    </div>
                    <u-table v-if="blocksData.productNumberYearsTableConverted.length > 0"
                        :template.sync="blocksData.productNumberYearsTemplate"
                        :table.sync="blocksData.productNumberYearsTableConverted"
                        :scroll="false"
                        class="product_years__table">
                        <template
                            v-for="(column, key) in blocksData.productNumberYearsTemplate.columns"
                            v-slot:[key]="{ row }">
                            <div v-if="column.meta.editable"
                                :key="column.name"
                                class="table-row-cells">
                                <div class="table-row-cell">
                                    <u-input
                                        v-model="row[column.name].cis_value"
                                        v-bind="column.meta.editable"
                                    />
                                </div>
                                <div class="table-row-cell">
                                    <u-input
                                        v-model="row[column.name].foreign_value"
                                        v-bind="column.meta.editable"
                                    />
                                </div>
                            </div>
                            <span
                                v-else
                                :key="column.name"
                                class="table-row-first">
                                <span class="table-row-span">
                                    {{ row[column.name] }}
                                </span>
                                <div class="table-row-cells">
                                    <span class="table-row-cell">
                                        {{ i18n('SNH') }}
                                    </span>
                                    <span class="table-row-cell">
                                        {{ i18n('Inozemni') }}
                                    </span>
                                </div>
                            </span>
                        </template>
                    </u-table>
                </template>
            </component-validation>

            <component-validation v-if="blocks.insuranceLogics"
                class="product__block"
                :label="`Vybir strakhovoyi lohiky`"
                :name="`productInsuranceLogic`"
                :errors="errors"
                :key="'insuranceLogics'">
                <template>
                    <div class="columns">
                        <div class="column field is-4-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                            <u-search :api-url="'/api/dynamicsearch/administration/insuranceLogics/initUTable'"
                                @accept="productInsuranceLogicTable = $event;
                                    blocksData.productInsuranceLogic.keywords = '';
                                    errors.clear('productInsuranceLogic')"
                                @cancel="blocksData.productInsuranceLogic.keywords = ''"
                                :table-search.sync="blocksData.productInsuranceLogic.keywords"
                                :min-length="3">
                                <div class="control has-icons-left has-icons-right">
                                    <u-input
                                        v-model="blocksData.productInsuranceLogic.keywords"
                                        type="text"
                                        :disabled="productInsuranceLogicTable.length > 0"
                                        placeholder="Oberit strahovu logiku"
                                    />
                                    <span class="icon is-small is-left">
                                        <fa icon="search" />
                                    </span>
                                </div>
                            </u-search>
                        </div>
                    </div>
                    <u-table v-if="productInsuranceLogicTable.length > 0"
                        :template="productInsuranceLogicTemplate"
                        :table.sync="productInsuranceLogicTable"
                        @remove-row="blocksData.productInsuranceLogic.button = false"
                        :scroll="false"
                        class="animated">
                        <template #actions>
                            <button @click="blocksData.productInsuranceLogic.button = !blocksData.productInsuranceLogic.button"
                                :class="[
                                    { 'is-active is-focused': blocksData.productInsuranceLogic.button },
                                    'button is-small is-table-button is-info',
                                ]">
                                <span class="icon is-small">
                                    <fa icon="info" />
                                </span>
                            </button>
                        </template>
                    </u-table>
                    <div v-show="blocksData.productInsuranceLogic.button"
                        class="text-bounded animated">
                        <i><fa icon="info-circle" size="2x"/></i>
                        <span v-if="blocksData.productInsuranceLogic.button">{{ productInsuranceLogicTable[0].description }}</span>
                    </div>
                </template>
            </component-validation>

            <component-validation v-if="blocks.linkedProducts"
                class="product__block"
                :label="`Povyazani produkty`"
                :name="`productLinkedProductsTable`"
                :errors="errors"
                :key="'linkedProducts'">
                <u-table :template="productLinkedProductsTemplate"
                    :table.sync="productLinkedProductsTable"
                    :scroll="false"
                    class="animated product__linked-products">
                    <template #rowToAdd_product_type_id="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.product_type_id.value"
                            :i18n="i18n"
                            :pivotParams="{
                                productClass: {
                                    id: rowToAdd.product_class_id.value,
                                },
                            }"
                            @selection="rowToAdd.product_type_id.selection = $event"
                            :disabled="!rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>
                    <template #rowToAdd_product_subtype_id="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.product_subtype_id.value"
                            :i18n="i18n"
                            :pivotParams="{
                                type: {
                                    id: rowToAdd.product_type_id.value,
                                },
                            }"
                            @selection="rowToAdd.product_subtype_id.selection = $event"
                            :disabled="!rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>
                    <template #rowToAdd_insurance_program_id="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.insurance_program_id.value"
                            :i18n="i18n"
                            :pivotParams="{
                                productSubtype: {
                                    id: rowToAdd.product_subtype_id.value,
                                },
                            }"
                            @selection="rowToAdd.insurance_program_id.selection = $event"
                            :disabled="!rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>
                    <template #rowToAdd_linked_products="{ rowToAdd, column }">
                        <vue-select
                            v-model="rowToAdd.linked_products.value"
                            :i18n="i18n"
                            :params="{
                                insurance_program_id: rowToAdd.insurance_program_id.value,
                            }"
                            @selection="rowToAdd.linked_products.selection = $event"
                            :disabled="!rowToAdd[column.refDisabled].value"
                            v-bind="column.props"/>
                    </template>
                </u-table>
            </component-validation>

            <component-validation v-if="blocks.requiredDocs"
                class="product__block"
                :label="`Obovyazkovi dokumenty`"
                :name="`productRequiredDocumentsTable`"
                :errors="errors"
                :key="'requiredDocs'">
                <u-table :template.sync="productRequiredDocumentsTemplate"
                    :table.sync="productRequiredDocumentsTable"
                    :scroll="false"
                    @add-row="errors.clear('productRequiredDocumentsTable')">
                </u-table>
            </component-validation>

            <component-validation v-if="blocks.documentTemplates"
                class="product__block"
                :label="`Шаблони документів`"
                :name="`productDocumentTemplatesTable`"
                :errors="errors"
                :key="'documentTemplates'">
                <u-table :template="productDocumentTemplatesTemplate"
                    :table.sync="productDocumentTemplatesTable"
                    :scroll="false"
                    class="animated"
                    ref="productDocumentTemplates"
                    @add-row="errors.clear('productDocumentTemplatesTable')">
                    <template #rowToAdd_printing_form_id="{ rowToAdd, column }">
                        <u-search ref="searchProductDocumentTemplates"
                            class="product__document-search"
                            :api-url="'/api/dynamicsearch/administration/printingForms/initProductUTable'"
                            @accept="
                                rowToAdd.printing_form_id.value = $event[0].id;
                                rowToAdd.qualified_name = $event[0].qualified_name;
                            "
                            :table-search.sync="blocksData.productDocumentTemplates.keyword"
                            :min-length="1">
                            <div class="control has-icons-left has-icons-right">
                                <div v-if="rowToAdd.printing_form_id.value"
                                    class="tagsinput field is-grouped is-grouped-multiline">
                                    <span class="tag">
                                        <span class="icon has-text-dark has-margin-right-small">
                                            <fa icon="print" />
                                        </span>
                                        <span>{{ rowToAdd.qualified_name }}</span>
                                        <button
                                            class="delete is-small"
                                            @click="
                                                rowToAdd.printing_form_id.value = null;
                                                rowToAdd.qualified_name = null;
                                            "
                                        />
                                    </span>
                                </div>
                                <u-input
                                    v-model="blocksData.productDocumentTemplates.keyword"
                                    type="text"
                                    :readonly="!!rowToAdd.printing_form_id.value"
                                    :placeholder="!rowToAdd.printing_form_id.value ? column.props.placeholder : ''"
                                    :disabled="!rowToAdd[column.refDisabled].value"
                                />
                                <span class="icon is-small is-left">
                                    <fa icon="search" />
                                </span>
                            </div>
                        </u-search>
                    </template>
                </u-table>
            </component-validation>

            <component-validation v-if="blocks.agencies"
                class="product__block"
                :label="`Ahentsiyi`"
                :name="`productAgenciesTable`"
                :errors="errors"
                :key="'agencies'">
                <u-dual-list :source="'administration/agencies/selectMultyOptions'"
                    :columns="['code', 'name']"
                    :data.sync="productAgenciesTable"
                    :policy-filter-id.sync="agency_filter_policy_id"
                    @change="errors.clear('productAgenciesTable')"/>
            </component-validation>

            <component-validation v-if="blocks.bankList"
                class="product__block"
                :label="`Banky`"
                :name="`productBanksTable`"
                :errors="errors"
                :key="'bankList'">
                <u-dual-list :source="'system/banks/selectOptions'"
                    :columns="['mfo', 'name']"
                    :data.sync="productBanksTable"
                    @change="errors.clear('productBanksTable')"/>
            </component-validation>

            <slot v-if="buttonsEnabled"
                name="buttons">
                <div class="product__btns level-right">
                    <button class="button is-success"
                        @click="getDataObject()">
                        {{i18n('Zberehty')}}
                    </button>
                </div>
            </slot>
        </div>

    </div>
</template>

<script>

import ProductParameters from './templates/ProductParameters.js'
import Account from './templates/Account.js'
import BrandModels from './templates/BrandModels.js'
import RequiredDocuments from './templates/RequiredDocuments.js'
import Franchises from './templates/Franchises.js'
import FranchisesOsago from './templates/FranchisesOsago.js'
import ProductNextPeriod from './templates/ProductNextPeriod.js'
import ProductInsuranceLogic from './templates/ProductInsuranceLogic.js'
import ProductLinkedProducts from './templates/ProductLinkedProducts.js'
import ProductDocumentTemplates from './templates/ProductDocumentTemplates.js'
import ProductCreditParameters from './templates/ProductCreditParameters.js'
import ProductPaymentLimits from './templates/ProductPaymentLimits.js'

import ElementValidation from '@components/validations/ElementValidation.vue'
import ComponentValidation from '@components/validations/ComponentValidation.vue'

import { VueSelect } from '@enso-ui/select/bulma'
import { Datepicker } from '@enso-ui/datepicker/bulma'
import VueSwitch from '@enso-ui/switch/bulma'
import UDualList from '@components/UDualList.vue'
import UTable from '@components/UTable.vue'
import USearch from '@components/USearch.vue'
import UInput from '@components/UInput.vue'
import { VTooltip } from 'v-tooltip'

export default {
    directives: { tooltip: VTooltip },

    components: {
        ElementValidation,
        ComponentValidation,
        VueSelect,
        Datepicker,
        VueSwitch,
        UDualList,
        UTable,
        USearch,
        UInput,
    },

    inject: ['i18n'],

    props: {
        productData: {
            type: Object,
        },
        errors: {
            type: Object,
        },
    },

    mixins: [
        ProductParameters,
        Account,
        BrandModels,
        RequiredDocuments,
        Franchises,
        FranchisesOsago,
        ProductNextPeriod,
        ProductInsuranceLogic,
        ProductLinkedProducts,
        ProductDocumentTemplates,
        ProductCreditParameters,
        ProductPaymentLimits,
    ],

    data() {
        return {
            insurance_product_id: null,
            old_id: null,
            activity_status: false,
            is_batch_only: false,
            is_next_period_only: false,
            is_multi_year_only: false,
            is_insurance_on_credit: false,
            is_onetime_commission_on_credit: false,
            is_action: false,
            activity_begin_datetime: null,
            activity_end_datetime: null,
            product_class_id: null,
            product_type_id: null,
            product_subtype_id: null,
            insurance_program_id: null,
            insurance_company_id: null,
            franchise_value: null,
            base_rate_value: null,
            product_code: null,
            product_name: null,
            product_credit_bank_name: null,
            product_description: null,
            product_notice: null,
            product_credit_repayment_schemas: [],
            product_currencies: [],
            productParametersTable: [],
            productCreditParametersTable: [],
            productBankAccountTable: [],
            productBrandModelsTable: [],
            productRequiredDocumentsTable: [],
            productFranchisesTable: [],
            productNextPeriodTable: [],
            productBaseRatesTable: [],
            productNumberYearsTable: [],
            agency_filter_policy_id: 3,
            productAgenciesTable: [],
            productBanksTable: [],
            productInsuranceLogicTable: [],
            productLinkedProductsTable: [],
            productDocumentTemplatesTable: [],
            productPaymentLimitsTable: [],

            blocksData: {
                account: {
                    keywords: ''
                },

                productBrandModels: {
                    groupModel: null,
                },

                productNextPeriod: {
                    keywords: ''
                },

                productInsuranceLogic: {
                    keywords: '',
                    button: false,
                },

                productBaseRatesTable: {
                    product_car_type_id: [],
                    product_risk_type_id: [],
                },
                productBaseRatesTableConverted: [],
                productBaseRatesTemplate: {
                    // dtRowId: 'insurance_product_kasko_base_rate_id',
                    search: false,
                    actions: false,
                    columns: [
                        {
                            label: 'Typ TZ',
                            name: 'product_car_type_name',
                            meta: {
                                sortable: true,
                            },
                            class: 'is-3-fullhd is-4-widescreen is-3-desktop is-6-tablet is-6-mobile is-narrow',
                        },
                    ],
                    rowTemplate: [
                        'product_car_type_id',
                        'product_car_type_name',
                        'product_risk_type_id',
                        'product_risk_type_name',
                        'value',
                    ],
                },

                activeFranchiseTemplate: {},

                productNumberYearsTable: {
                    product_car_type_id: [],
                    product_period_id: [],
                },
                productNumberYearsTableConverted: [],
                productNumberYearsTemplate: {
                    // dtRowId: 'insurance_product_kasko_period_id',
                    search: false,
                    actions: false,
                    columns: [
                        {
                            label: 'Kilkist rokiv',
                            name: 'product_period_name',
                            class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile is-narrow',
                            meta: {
                                sortable: true,
                            },
                        },
                    ],
                    rowTemplate: [
                        'product_period_id',
                        'product_period_name',
                        'product_car_type_id',
                        'product_car_type_name',
                        'cis_value',
                        'foreign_value',
                    ],
                },
                productDocumentTemplates: {
                    keyword: '',
                    data: [],
                }
            },
            blocks: {},
            buttonsEnabled: false,
        }
    },

    computed: {
        productTypeParams() {
            return {
                productClass: {
                    'id':  this.product_class_id,
                }
            };
        },
        productSubTypeParams() {
            return {
                type: {
                    'id':  this.product_type_id,
                }
            };
        },
        insuranceProgramParams() {
            return {
                productSubtype: {
                    'id':  this.product_subtype_id,
                }
            };
        },
    },

    created() {
        this.updateData(this.productData);
    },

    methods: {
        updateData(data) {
            Object.entries(data).forEach(([key, value]) => {
                this[key] = value;
            });
            // this.data = { ...this.data, ...data };

            if (data.productBaseRatesTable) this.generateTable(this.productBaseRatesTable, 'product_car_type_id', 'product_risk_type_id', 'x', 'product_car_type_id', 'productBaseRates');
            if (data.productNumberYearsTable) this.generateTable(this.productNumberYearsTable, 'product_car_type_id', 'product_period_id', 'x', 'product_period_id', 'productNumberYears');
        },

        setBlocksProductType(productTypeSelection) {
            if (!productTypeSelection) return;

            this.buttonsEnabled = true;

            const { alias } = productTypeSelection;
            switch(alias) {
                case 'vehicleKaskoBank':
                case 'vehicleKaskoLeasing':
                    this.blocksData.activeFranchiseTemplate = { ...this.blocksData.activeFranchiseTemplate, ...this.franchisesTemplate };
                    this.blocks = {
                        activation: true,
                        isBatchOnly: true,
                        isNextPeriodOnly: true,
                        parameters: true,
                        account: true,
                        description: true,
                        notice: true,
                        brandModel: true,
                        requiredDocs: true,
                        productNextPeriod: true,
                        basicTariffs: true,
                        franchise: true,
                        years: true,
                        insuranceLogics: true,
                        documentTemplates: true,
                        agencies: true,
                        bankList: true,
                    };
                    break;

                case 'vehicleKaskoRetail':
                    this.blocksData.activeFranchiseTemplate = { ...this.blocksData.activeFranchiseTemplate, ...this.franchisesTemplate };
                    this.blocks = {
                        activation: true,
                        isBatchOnly: true,
                        isNextPeriodOnly: true,
                        parameters: true,
                        account: true,
                        description: true,
                        notice: true,
                        brandModel: true,
                        requiredDocs: true,
                        productNextPeriod: true,
                        basicTariffs: true,
                        franchise: true,
                        years: true,
                        insuranceLogics: true,
                        documentTemplates: true,
                        agencies: true,
                    };
                    break;

                case 'vehicleOsago':
                    this.blocksData.activeFranchiseTemplate = { ...this.blocksData.activeFranchiseTemplate, ...this.franchisesOsagoTemplate };
                    this.blocks = {
                        activation: true,
                        isBatchOnly: true,
                        isNextPeriodOnly: true,
                        parameters: true,
                        requiredDocs: true,
                        franchise: true,
                        account: true,
                        description: true,
                        notice: true,
                        insuranceLogics: true,
                        documentTemplates: true,
                    };
                    break;

                case 'vehicleCarLoan':
                case 'vehicleLeasing':
                    this.blocks = {
                        activation: true,
                        isBatchOnly: true,
                        isNextPeriodOnly: true,
                        isInsuranceOnCredit: true,
                        isOnetimeCommissionOnCredit: true,
                        isAction: true,
                        credit: true,
                        parameters: true,
                        creditParameters: true,
                        description: true,
                        notice: true,
                        brandModel: true,
                        requiredDocs: true,
                        productNextPeriod: true,
                        insuranceLogics: true,
                        documentTemplates: true,
                        linkedProducts: true,
                        agencies: true,
                        bankList: true,
                    };
                    break;

                case 'vehicleDscv':
                    this.blocks = {
                        activation: true,
                        isBatchOnly: true,
                        isNextPeriodOnly: true,
                        paymentLimits: true,
                        parameters: true,
                        account: true,
                        description: true,
                        notice: true,
                        insuranceLogics: true,
                        requiredDocs: true,
                        documentTemplates: true,
                        agencies: true,
                    };
                    break;

                case 'personalIncident':
                case 'personalIncidentBank':
                    this.blocks = {
                        activation: true,
                        isBatchOnly: true,
                        isNextPeriodOnly: true,
                        parameters: true,
                        account: true,
                        description: true,
                        notice: true,
                        productNextPeriod: true,
                        insuranceLogics: true,
                        requiredDocs: true,
                        agencies: true,
                        bankList: true,
                        documentTemplates: true,
                    };
                    break;

                default:
                    this.blocks = {};
                    this.buttonsEnabled = false;
                    this.productFranchisesTable = [];
                    break;
            };
        },

        generateTable(ids, name, refName, axis, selectRefName, tableName) {
            let newTable = [];

            let tableNames = {
                name: `${tableName}Table`,
                template: `${tableName}Template`,
                converted: `${tableName}TableConverted`,
            };

            let rowTemplate = this.blocksData[tableNames.template].rowTemplate;

            // if (ids.length === 0) {
            //     this.$refs[name].hideDropdown();
            // }

            if (axis === 'x') {
                const rowIds = this.blocksData[tableNames.converted].filter((row) => row[name]).map((row) => row[name]);

                if (ids.length > rowIds.length) {
                    const differenceId = _.difference(ids, rowIds)[0];

                    this.blocksData[tableNames.template].columns.forEach((column) => {
                        if (!column.id) return;

                        let newRow = {};
                        rowTemplate.forEach((columnName) => {
                            newRow[columnName] = 0;
                        });
                        newRow[rowTemplate[0]] = differenceId;
                        newRow[rowTemplate[1]] = this.$refs[selectRefName].selection.find((option) => option.id === differenceId).name;
                        newRow[rowTemplate[2]] = column.id;
                        newRow[rowTemplate[3]] = column.label;

                        newTable.push(newRow);
                    });

                    this[tableNames.name] = newTable.concat(this[tableNames.name]);
                } else {
                    const differenceId = _.difference(rowIds, ids)[0];

                    newTable = this[tableNames.name].filter((cell) => cell[name] !== differenceId);
                    this[tableNames.name] = newTable;
                    if (ids.length === 0) {
                        this.blocksData[tableNames.name][refName] = [];
                        this[tableNames.name] = [];
                    }
                }
            } else {
                let columnIds = this.blocksData[tableNames.template].columns.filter((column) => column.id).map((column) => column.id);

                if (ids.length > columnIds.length) {
                    const differenceId = _.difference(ids, columnIds)[1] || _.difference(ids, columnIds)[0];

                    this.blocksData[tableNames.name][refName].forEach((rowId) => {
                        let newRow = {};
                        rowTemplate.forEach((columnName) => {
                            newRow[columnName] = 0;
                        });
                        newRow[rowTemplate[0]] = rowId;
                        newRow[rowTemplate[1]] = this.$refs[selectRefName].selection.find((option) => option.id === rowId).name;
                        newRow[rowTemplate[2]] = differenceId;
                        newRow[rowTemplate[3]] = this.$refs[name].selection.find((option) => option.id === differenceId).name;

                        newTable.push(newRow);
                    });

                    this[tableNames.name] = newTable.concat(this[tableNames.name]);
                } else {
                    const differenceId = _.difference(columnIds, ids)[0];

                    newTable = this[tableNames.name].filter((cell) => cell[name] !== differenceId);
                    this[tableNames.name] = newTable;

                    if (ids.length === 0) {
                        this.blocksData[tableNames.name][refName] = [];
                        this[tableNames.name] = [];
                    }
                }
            }

            this.blocksData[tableNames.template].columns.splice(1);

            if (this[tableNames.name]) {
                this.cellsToRows(this[tableNames.name], rowTemplate, tableNames);
            }
        },
        cellsToRows(cells, rowTemplate, tableNames) {
            let newStructure = {},
                newColumns = {};

            cells.forEach((cell) => {
                if (!newStructure[cell[rowTemplate[1]]]) {
                    newStructure[cell[rowTemplate[1]]] = {
                        [rowTemplate[0]]: cell[rowTemplate[0]],
                        [rowTemplate[1]]: cell[rowTemplate[1]],
                    };
                }

                Object.assign(newStructure[cell[rowTemplate[1]]], {
                    [cell[rowTemplate[2]]]: cell,
                });

                if (!newColumns[cell[rowTemplate[2]]]) {
                    newColumns[cell[rowTemplate[2]]] = {
                        label: cell[rowTemplate[3]],
                        name: cell[rowTemplate[2]],
                        id: cell[rowTemplate[2]],
                        meta: {
                            editable: {
                                type: 'number',
                                min: 0,
                            },
                        },
                    }
                }

                const productRiskTypeId = this.blocksData[tableNames.name][rowTemplate[2]];
                const productCarTypeId = this.blocksData[tableNames.name][rowTemplate[0]];
                const cellRiskType = cell[rowTemplate[2]];
                const cellCarType = cell[rowTemplate[0]];

                if (!productRiskTypeId.includes(cellRiskType)) {
                    this.blocksData[tableNames.name][rowTemplate[2]].push(cellRiskType);
                }
                if (!productCarTypeId.includes(cellCarType)) {
                    this.blocksData[tableNames.name][rowTemplate[0]].push(cellCarType);
                }
            });

            this.blocksData[tableNames.converted] = Object.values(newStructure);
            this.blocksData[tableNames.template].columns.push(...Object.values(newColumns));
        },
        getBrandGroups() {
            axios.get(`/api/administration/brandsGroups/${this.blocksData.productBrandModels.groupModel}/getBrandModels`)
                .then(({ data }) => {
                    this.blocksData.productBrandModels.groupModel = null;
                    this.updateData({ productBrandModelsTable: data.brandModelsTable });
                });
        },

        getDataObject() {
            const data = {
                insurance_product_id: this.insurance_product_id,
                old_id: this.old_id,
                activity_status: this.activity_status,
                is_batch_only: this.is_batch_only,
                is_next_period_only: this.is_next_period_only,
                is_multi_year_only: this.is_multi_year_only,
                is_insurance_on_credit: this.is_insurance_on_credit,
                is_onetime_commission_on_credit: this.is_onetime_commission_on_credit,
                is_action: this.is_action,
                activity_begin_datetime: this.activity_begin_datetime,
                activity_end_datetime: this.activity_end_datetime,
                product_class_id: this.product_class_id,
                product_type_id: this.product_type_id,
                product_subtype_id: this.product_subtype_id,
                insurance_program_id: this.insurance_program_id,
                insurance_company_id: this.insurance_company_id,
                franchise_value: this.franchise_value,
                base_rate_value: this.base_rate_value,
                product_code: this.product_code,
                product_name: this.product_name,
                product_credit_bank_name: this.product_credit_bank_name,
                product_description: this.product_description,
                product_notice: this.product_notice,
                product_credit_repayment_schemas: this.product_credit_repayment_schemas,
                product_currencies: this.product_currencies,
                productParametersTable: this.productParametersTable,
                productCreditParametersTable: this.productCreditParametersTable,
                productBankAccountTable: this.productBankAccountTable,
                productBrandModelsTable: this.productBrandModelsTable,
                productRequiredDocumentsTable: this.productRequiredDocumentsTable,
                productFranchisesTable: this.productFranchisesTable,
                productNextPeriodTable: this.productNextPeriodTable,
                productBaseRatesTable: this.productBaseRatesTable,
                productNumberYearsTable: this.productNumberYearsTable,
                agency_filter_policy_id: this.agency_filter_policy_id,
                productAgenciesTable: this.productAgenciesTable,
                productBanksTable: this.productBanksTable,
                productInsuranceLogicTable: this.productInsuranceLogicTable,
                productLinkedProductsTable: this.productLinkedProductsTable,
                productDocumentTemplatesTable: this.productDocumentTemplatesTable,
                productPaymentLimitsTable: this.productPaymentLimitsTable,
            }

            this.$emit('save', data);
        },

        selectionBrandModelPolicy(selection, rowToAdd) {
            rowToAdd.car_model_filter_policy_id.selection = selection;
            if (selection && selection.alias === 'all') {
                this.productBrandModelsTemplate.columns.carModels.refDisabled = false;
                this.productBrandModelsTemplate.columns.carModels.props.placeholder = 'Vsi modeli';
                this.productBrandModelsTemplate.columns.carModels.disabled = true;
                rowToAdd.carModels.value = [];
            } else {
                this.productBrandModelsTemplate.columns.carModels.refDisabled = 'car_model_filter_policy_id';
                this.productBrandModelsTemplate.columns.carModels.props.placeholder = 'Oberit model';
                this.productBrandModelsTemplate.columns.carModels.disabled = false;
            }
        },
        uniqBy(data, newData) {
            return _.uniqBy([...data, ...newData], 'dtRowId');
        },
    },
};

</script>

<style lang="sass">
    .product
        margin-bottom: 2rem
        .columns:not(:last-child)
            margin-bottom: 0
        .field .label
            font-size: .8rem
        &__parameters
            padding-bottom: 1rem
            padding-left: .5rem
            padding-right: .5rem
            padding-top: 1rem
            margin-bottom: 1rem
        &__block
            padding-bottom: 2.5rem
            padding-top: 2rem
            margin-left: -0.8em
            padding-left: 1.5rem
            margin-right: -0.8em
            padding-right: 1.5rem
            transition: .5s
            &:nth-of-type(2n)
                box-shadow: inset 0 0 10px -2px hsla(0,0%,3%,.2)
                background-color: rgba(235, 235, 235, .1)
            &:first-of-type
                padding-top: .5em
            &.product-notice
                background: #e74c3c14

            .title
                font-size: 1rem
            .text-bounded
                background-color: #f5f5f5
                padding: 1em 16px
                border-radius: 6px
                font-size: .9rem
                font-weight: 300
                margin-bottom: 20px
                margin-top: 20px
                transition: 5s
                display: flex
                align-items: center
                span
                    line-height: 1.4
                i
                    color: #209cee
                    margin-right: .75em
        &_parameters
            h3 + .product-parameters .search-filter
                margin-top: -62px
        &__activation
            padding-top: 1.5rem
            padding-bottom: 1.5rem
            &_btn
                display: flex
                align-items: center
            label.title
                cursor: pointer
                margin-right: 1rem
                margin-bottom: 0 !important
        &__switchers
            padding: 10px 10px
            margin-top: 0
            .column
                display: flex
                align-items: center
                .title
                    cursor: pointer
        &_franchise
            .table
                .utable-th,
                .utable-td
                    vertical-align: middle
                    &.actions
                        width: 90px
                        text-align: center
                        button
                            display: inline-block
                            margin-left: auto
                            margin-right: auto

                .utable-td
                    position: relative
                    transition: .3s
                    &:first-of-type
                        border-right: none

        &_years
            &__table
                .table-body
                    .column
                        padding: 0
                .table-row
                    overflow: hidden
                    padding: 0
                    &-first
                        display: flex
                        width: 100%
                        height: 100%
                        .table-row-cells
                            width: 50%
                    &-span
                        display: flex
                        justify-content: center
                        align-items: center
                        width: 50%
                        border-right: 1px solid #dbdbdb
                    &-cells
                        display: flex
                        flex-direction: column
                        width: 100%
                    &-cell
                        display: flex
                        justify-content: center
                        align-items: center
                        height: 50%
                        padding: 1em
                        &:not(:first-of-type)
                            border-top: 1px solid #dbdbdb

        &__document-search
            width: 100%
            .tag
                .delete
                    margin-left: .5rem
            .tagsinput
                position: absolute
                z-index: 99999
                left: 40px
                top: 6px
                .tag
                    margin: 0 0.2rem 0 0
                    &:last-of-type
                        margin-right: .4rem;
                .icon
                    position: relative
                input
                    font-size: 1rem
                    &::placeholder
                        opacity: .5
                    &:focus
                        outline: none

        &__linked-products
            .column_linked_products
                .tag
                    display: flex
                    height: auto
                    white-space: normal

        &__btns
            margin-top: 2rem
</style>
