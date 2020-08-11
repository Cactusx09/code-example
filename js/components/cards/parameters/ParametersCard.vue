@@ -1,610 +1,601 @@
<template>
    <div class="parameters">
        <div v-if="
                [
                    'consultation',
                    'insurance',
                    'credit'
                ].includes(parametersOptions.stateAlias)
                && insuranceProgramParamsData.inited
            "
            class="consultation__parameters_fields _enabled">

            <enso-form
                :template="insuranceProgramParamsData.header"
                :path="route('insuranceprogramparams.getData')"
                @ready="$emit('header-ready')"
                class="header"
                ref="header">
                <template #product_type_id="props">
                    <form-field
                        v-bind="props"
                        @selection="$refs.header.field('product_subtype_id').meta.pivotParams.type.id = props.field.value || null"/>
                </template>

                <template #product_subtype_id="props">
                    <form-field
                        v-bind="props"
                        :pivot-params="props.field.meta.pivotParams"

                        @selection="
                            $refs.header.field('insurance_program_id').meta.pivotParams.productSubtype.id = props.field.value || null;
                            insuranceProgramParamsData.alias = $event ? $event.alias : null;
                            $event
                                ? $store.dispatch('wizard/updateStepGroupStyle', { groupName: 'header' , nextGroupName: 'structure' })
                                : $store.dispatch('wizard/resetGroupsStyle', ['header', 'structure', 'selectProducts', 'setExtraParams']);
                        "/>
                </template>

                <template #insurance_program_id="props">
                    <form-field
                        v-bind="props"
                        @selection="props.field.meta.pivotParams.productSubtype.id
                            ? getDynamicProgramParams($refs.header.field('product_subtype_id').value)
                            : null"
                        :pivot-params="props.field.meta.pivotParams"
                        class="insurance-program"/>
                </template>

                <template #use_custom_classifier="props">
                    <slot
                        :name="props.field.name"
                        :props="props"/>
                </template>
            </enso-form>

            <div v-if="insuranceProgramParamsData.alias && [...insuranceProgramParamsData.dynamicFields].length > 0"
                class="consultation__parameters_conditions">
                <div
                    v-for="(block, key, index) in insuranceProgramParamsData.dynamicFields"
                    :key="key">

                    <div class="is-divider">
                        <div class="has-text-centered is-unselectable">
                            <div class="tag is-medium">{{ i18n(block.name) }}</div>
                            <div v-if="block.collapsed !== null"
                                @click="toogleHiddenFields(key, !block.collapsed)"
                                class="has-text-link tag">
                                <span>{{ block.collapsed ? i18n('Rozhornuty') : i18n('Zhornuty') }}</span>
                                <dropdown-indicator :open="!block.collapsed"/>
                            </div>
                        </div>
                    </div>

                    <enso-form
                        :template="block"
                        :path="route('insuranceprogramparams.getData')"
                        :ref="`dynamicParameters-${key}`"
                        :key="`${key}_${index}`">
                        <template #sportsmen_caterogy_id="props">
                            <form-field
                                v-bind="props"
                                @selection="$set(props.field.meta, 'tooltip', $event ? $event.description : null)"
                                :options="props.field.meta.options"/>
                        </template>
                        <template #occupation_group_id="props">
                            <form-field
                                v-bind="props"
                                @selection="$set(props.field.meta, 'tooltip', $event ? $event.description : null)"
                                :options="props.field.meta.options"/>
                        </template>

                        <template #car_usage_purpose_id="props">
                            <form-field
                                v-bind="props"
                                @input="bindKaskoOsagoField({ alias: key, field: props.field })"/>
                        </template>
                        <template #driving_experience_id="props">
                            <form-field
                                v-bind="props"
                                @input="bindKaskoOsagoField({ alias: key, field: props.field })"/>
                        </template>

                        <template #person_count_id="props">
                            <form-field
                                v-bind="props"
                                @selection="personCountChange({ event: $event, key: key })"/>
                        </template>
                    </enso-form>
                </div>

                <div v-if="insuranceProgramParamsData.alias === 'vehicleDscv'">
                    <div class="box has-background-danger has-text-white has-margin-bottom-large">
                        <p class="has-margin-bottom-medium">
                            <span class="title is-5 has-text-white">{{ i18n('UVAHA') }}!!!</span>
                        </p>
                        <span>{{ i18n('Dlya razrakhunku strakhovoho produktu DSTsV obovyazkovo vkazhit v Obyekti strakhuvannya derzhnomer ta vinkod avtomobilya!') }}</span>
                    </div>
                </div>

                <div class="consultation__parameters-buttons level-right">
                    <button
                        v-if="typeData.inited && parametersOptions.stateAlias === 'consultation'"
                        @click="
                            typeData.inited = false;
                            consultationHistoryData.inited = true;
                            $store.dispatch('wizard/resetGroupsStyle', ['structure', 'selectProducts', 'setExtraParams']);
                        "
                        class="button is-warning is-small has-margin-right-medium">
                        {{ i18n('Cancel') }}
                    </button>
                    <button
                        class="button is-success"
                        @click="
                            setTypeComponent();
                            typeData.productsData = null;
                        ">
                        <span class="is-small has-margin-right-small">
                            <fa icon="search"/>
                        </span>
                        {{ i18n('Znayty') }}
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="typeData.inited"
            class="consultation__parameters_products has-margin-top-large">
            <type1
                v-if="[
                    'vehicleKaskoRetail',
                    'vehicleOsago',
                    'vehicleDscv',
                    'vehicleKaskoBank',
                    'vehicleKaskoLeasing',
                    'personalIncident',
                    'personalIncidentBank',
                ].includes(insuranceProgramParamsData.alias)"
                @loaded="loaded($event)"
                @set-extra-params="setExtraParams()"
                @add-product="addProduct()"
                @saved="savedType($event)"
                @prolongation-required="confirmProlongate = $event"
                :state-id="stateId"
                :type-data="typeData"
                :insurance-program-params-data="insuranceProgramParamsData"/>
            <type2
                v-if="[
                    'vehicleCarLoan',
                    'vehicleLeasing',
                ].includes(insuranceProgramParamsData.alias)"
                @loaded="loaded($event)"
                @set-extra-params="setExtraParams()"
                @add-product="addProduct()"
                @saved="savedType($event)"
                :state-id="stateId"
                :type-data="typeData"
                :insurance-program-params-data="insuranceProgramParamsData"/>
        </div>

        <confirm-modal :visible.sync="confirmProlongate">
            <template #header>
                <div class="notification is-danger">
                    <div class="has-margin-bottom-medium">
                        <p class="title is-6">
                            {{ i18n('UVAHA!!') }}
                        </p>
                    </div>

                    <span>{{ i18n(confirmProlongate) }}</span>
                </div>
            </template>
            <template #submit>
                <button
                    class="button is-success has-margin-left-small"
                    :disabled="!canAccess('inwork.consultations.suggestProducts.canProlongateContracts')"
                    @click="
                        confirmProlongate = false;
                        $router.push({ name: 'inwork.consultations.prolongation.create' })
                    ">
                    {{ i18n('Prolonhatsiya') }}
                </button>
            </template>
        </confirm-modal>

        <consultation-history
            v-if="
                !typeData.inited
                && parametersOptions.stateAlias !== 'insurance'
            "
            :consultation-history-data="consultationHistoryData"
            :route="parametersOptions.apiRoutes.getHistory"
            ref="consultationHistory">
            <template #header>
                <slot name="historyHeader"
                    v-if="consultationHistoryData.productsTable.length > 0"
                    :consultationHistoryData="consultationHistoryData"/>
            </template>
        </consultation-history>
    </div>
</template>

<script>
    import DropdownIndicator from '@enso-ui/dropdown-indicator'

    import Type1 from '@components/cards/parameters/Type1'
    import Type2 from '@components/cards/parameters/Type2'

    import { EnsoForm, FormField } from '@enso-ui/forms/bulma'

    import UTable from '@components/UTable'
    import Params from './ExtraParams'

    import ConsultationHistory from '@components/cards/parameters/ConsultationHistory'

    import ConfirmModal from '@components/ConfirmModal'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            DropdownIndicator,

            Type1,
            Type2,

            EnsoForm,
            FormField,

            UTable,
            Params,

            ConsultationHistory,
            ConfirmModal,
        },

        inject: ['i18n', 'canAccess'],

        mixins: [
            errorHandler,
        ],

        props: {
            parametersOptions: {
                type: Object,
            },
            stateId: {
                type: Object,
            },
        },

        data() {
            return {
                insuranceProgramParamsData: {
                    inited: false,
                    header: {},

                    dynamicFields: {},

                    alias: null,
                },

                typeData: {
                    inited: false,
                    isInfoActive: false,
                    stateAlias: this.parametersOptions.stateAlias,
                    productsData: this.parametersOptions.productsData,
                    apiRoutes: this.parametersOptions.apiRoutes,
                },

                consultationHistoryData: {
                    productsTable: [],
                    inited: true,
                    isInfoActive: false,
                    route: this.parametersOptions.apiRoutes.getHistory,
                    extraParams: {
                        rows: [],
                        disabled: true,
                    },
                    status: {
                        alias: null,
                    },
                    buttonsStatus: {
                        create: false,
                        goto: false,
                        compare: false,
                    },
                    checkedRows: [],
                },

                confirmProlongate: null,
            }
        },

        created() {
            if (this.parametersOptions.parametersStructure) {
                const searchStructure = this.parametersOptions.parametersStructure.searchStructure;

                this.insuranceProgramParamsData.header = searchStructure.header.form;
                delete searchStructure.header;

                this.insuranceProgramParamsData.dynamicFields = {};

                this.insuranceProgramParamsData.alias = this.parametersOptions.alias;

                for(let key in searchStructure) {
                    this.$set(this.insuranceProgramParamsData.dynamicFields, key, searchStructure[key].form);

                    this.toogleHiddenFields(key, true);
                }

                this.insuranceProgramParamsData.inited = true;
            } else {
                this.getProgramParams();
            }
        },

        methods: {
            getProgramParams() {
                axios.get(
                        route(this.parametersOptions.apiRoutes.getForm.url),
                        this.parametersOptions.apiRoutes.getForm
                    )
                    .then(({ data }) => {
                        this.insuranceProgramParamsData.header = data.searchStructure.header.form;

                        this.insuranceProgramParamsData.inited = true;
                        this.typeData.inited = false;

                        this.$emit('get-params', data);

                        this.$nextTick(() => {
                            this.$store.commit('wizard/updateGroupPosition', {
                                group: 'header',
                                position: { offset: -10 },
                                elSelector: '.consultation__parameters_fields .header',
                            });
                        });
                    })
                    .catch((error) => {
                        this.errorHandler(error);

                        this.insuranceProgramParamsData.inited = false;
                    });
            },
            getDynamicProgramParams(productSubTypeId) {
                const params = {
                    product_type_id: this.$refs.header.field('product_type_id').value,
                    product_subtype_id: productSubTypeId,
                    insurance_program_id: this.$refs.header.field('insurance_program_id').value,
                    ...this.parametersOptions.apiRoutes.getForm.params,
                };

                axios.get(route(this.parametersOptions.apiRoutes.getForm.url), {
                        params: params,
                    })
                    .then(({ data }) => {
                        this.typeData.inited = false;
                        this.insuranceProgramParamsData.dynamicFields = {};

                        Object.keys(data.searchStructure).map((key) => {
                            if (key === 'header') return;

                            this.$set(this.insuranceProgramParamsData.dynamicFields, key, data.searchStructure[key].form);

                            this.toogleHiddenFields(key, true);
                        });

                        this.$emit('get-dynamic-params', data);

                        if (!this.insuranceProgramParamsData.alias) return;

                        this.$store.dispatch('wizard/setSelectedSections', {
                            whiteList: ['insuranceObjects'],
                            params: {
                                product_subtypes: [this.insuranceProgramParamsData.alias],
                            },
                        });

                        this.$nextTick(() => {
                            this.$store.commit('wizard/updateGroupPosition', {
                                group: 'structure',
                                position: { align: 'center', offset: -25 },
                                elSelector: '.consultation__parameters_conditions',
                            });
                        });
                    })
                    .catch((error) => {
                        this.errorHandler(error);

                        this.insuranceProgramParamsData.inited = false;
                    });
            },
            toogleHiddenFields(sectionKey, hidden) {
                this.$nextTick(() => {
                    let hasCollapsedFields = false;

                    const sectionRef = this.$refs[`dynamicParameters-${sectionKey}`][0];
                    Object.keys(sectionRef.formData).forEach((fieldKey) => {
                        const field = sectionRef.field(fieldKey);
                        if (field.meta.isBatchCollapsed) {
                            this.$set(field.meta, 'hidden', hidden);
                            hasCollapsedFields = true;
                        }
                    });
                    this.$set(this.insuranceProgramParamsData.dynamicFields[sectionKey], 'collapsed', hasCollapsedFields ? hidden : null);
                });
            },
            bindKaskoOsagoField({ alias, field }) {
                if (['vehicleCarLoan', 'vehicleLeasing'].includes(this.insuranceProgramParamsData.alias)) return;

                const refProductType = alias === 'vehicleOsago' ? 'vehicleKaskoBank' : 'vehicleOsago';
                this.$refs[`dynamicParameters-${refProductType}`][0].field(field.name).value = field.value;
            },
            personCountChange({ event, key }) {
                const disabled = event ? event.alias === 'personCount::legalGrounds' : false;

                this.$set(this.$refs[`dynamicParameters-${key}`][0].field('driving_experience_id').meta, 'disabled', disabled);
                this.$set(this.$refs[`dynamicParameters-${key}`][0].field('drivers_age_id').meta, 'disabled', disabled);
            },

            setTypeComponent() {
                this.typeData.inited = false;
                this.consultationHistoryData.inited = false;

                this.insuranceProgramParamsData.fields = {
                    header: {
                        ...this.$refs.header.formData,
                    }
                };

                Object.keys(this.insuranceProgramParamsData.dynamicFields).forEach((key) => {
                    this.insuranceProgramParamsData.fields[key] = this.$refs[`dynamicParameters-${key}`][0].formData;
                });

                this.$nextTick(() => {
                    this.typeData.inited = true;
                });
            },

            savedType(response) {
                if (['consultation', 'actualization', 'questionnaires'].includes(this.parametersOptions.stateAlias)) {
                    this.consultationHistoryData.inited = true;
                }
                this.typeData.inited = false;

                this.$emit('saved-params', response);

                this.$store.dispatch('wizard/resetGroupsStyle', ['structure', 'selectProducts', 'setExtraParams']);
                this.$store.commit('wizard/updateGroupStyle', { group: 'save', style: 'done' });
            },

            setExtraParams(row, activeRowIndex) {
                const formattedCalculations = row.calculations.map((item) => ({
                    productRecalcObject: item.data,
                    fields: item.fields,
                }));

                this.consultationHistoryData.extraParams.rows = formattedCalculations;

                this.$refs.consultationHistoryData.setActiveRow(activeRowIndex);
                this.consultationHistoryData.isInfoActive = true;
                this.typeData.isInfoActive = false;
            },

            loaded(data) {
                this.consultationHistoryData.inited = data.length > 0;
                this.$store.dispatch('wizard/updateStepGroupStyle', { groupName: 'structure', nextGroupName: 'selectProducts' });
                this.$nextTick(() => {
                    this.$store.commit('wizard/updateGroupPosition', {
                        group: 'selectProducts',
                        position: { offset: 20 },
                        elSelector: '.consultation__parameters_list',
                    });
                    this.$store.dispatch('wizard/setSelectedSections', {
                        whiteList: ['insuranceObjects'],
                        params: {
                            product_subtypes: [this.insuranceProgramParamsData.alias],
                        },
                    });
                });
            },
            setExtraParams() {
                this.$store.dispatch('wizard/updateStepGroupStyle', { groupName: 'selectProducts', nextGroupName: 'setExtraParams' });
                this.$nextTick(() => {
                    this.$store.commit('wizard/updateGroupPosition', {
                        group: 'setExtraParams',
                        position: { offset: -5 },
                        elSelector: '.consultation__parameters_products .extra',
                    });
                });
            },
            addProduct() {
                this.$store.dispatch('wizard/updateGroupsStyle', {
                    setExtraParams: 'done',
                    save: 'style',
                });
                this.$nextTick(() => {
                    this.$store.commit('wizard/updateGroupPosition', {
                        group: 'save',
                        position: { offset: 30 },
                        elSelector: '.consultation__parameters_choosed',
                    });
                });
                this.consultationHistoryData.isInfoActive = false;
            },
        },
    }
</script>

<style lang="sass">
@import "~bulma/sass/utilities/_all"

.consultation
    &__parameters
        padding: 1rem 0

        .is-divider
            margin: 1.5rem -24px

        &_fields
            .header
                .label
                    font-size: .88rem
                .button
                    font-weight: 600
                    background-color: #209cee33
                    border: 1px solid $info
                    &:not([disabled])
                        border-color: #209cee33
                .field.insurance-program
                    .button:not([disabled])
                        border-color: #dbdbdb
                        background: none
                        color: $grey

            .is-divider
                position: relative
                margin: 1.5rem 0 2rem
                .tag
                    margin-top: -1rem
                    font-weight: 700
                .has-text-link
                    position: absolute
                    right: 0
                    top: 0
                    cursor: pointer
                    display: flex
                    align-items: center

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
            .column_calculations
                .dropdown.vue-select .dropdown-menu .dropdown-content .options
                    max-height: 12em

        &_list,
        &_fields
            margin-bottom: 1.5rem
            .vue-select:not([value])
                .button:not([disabled])
                    color: #e74c3c
                    font-weight: 600
                    background: #e74c3c14

                &.calculation-error-select
                    .button:not([disabled])
                        background-color: whitesmoke
                        border-color: whitesmoke
                        color: $grey
                        .control-display
                            color: #e74c3c
        &-buttons
            justify-content: flex-end
            display: flex

        &_choosed
            padding-bottom: .5rem

        &_history
            .tag
                height: auto
            &Header
                margin-bottom: .6rem !important
                .title
                    font-size: 1.05rem
                    margin-bottom: 0

</style>
