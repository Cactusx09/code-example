<template>
    <div v-if="init"
        class="calculation-commission">
        <div class="columns">
            <div class="column field is-6-fullhd is-6-widescreen is-6-desktop is-12-tablet is-12-mobile">
                <element-validation
                    v-model="data.name"
                    label="Nazva"
                    name="name"
                    placeholder="Vvedit nazvy"
                    :errors="errors"
                />
            </div>

            <div class="column field is-6-fullhd is-6-widescreen is-6-desktop is-12-tablet is-12-mobile">
                <div class="field">
                    <label
                        @click="data.is_active = !data.is_active"
                        class="label">
                        {{ i18n('Aktyvuvaty komisiyu') }}
                    </label>

                    <vue-switch
                        v-model="data.is_active"
                        class="vue-switch is-large is-info"
                        size="is-large"
                        type="is-success"
                    />
                </div>
            </div>
        </div>

        <div class="columns">
            <div class="column field is-12-fullhd is-12-widescreen is-12-desktop is-12-tablet is-12-mobile">
                <element-validation
                    label="Opys"
                    name="description"
                    :errors="errors"
                    key="description">
                    <textarea
                        v-model="data.description"
                        key="description"
                        placeholder="Vvedit opys"
                        :class="['textarea', { 'is-danger': errors.has('description') }]"
                        @input="errors.clear('description')"
                    />
                </element-validation>
            </div>
        </div>

        <component-validation
            label="Rozmir komisiynoyi vynahorody"
            name="commissionTypesValues"
            class="calculation-commission-section"
            :errors="errors"
            key="commissionTypesValues">
            <commission-types-values
                v-model="data.commissionTypesValues"
            />
        </component-validation>

        <component-validation
            label="Strakhovoyi lohiky"
            name="insuranceLogicTable.0.dtRowId"
            class="calculation-commission-section"
            :errors="errors"
            key="insuranceLogicTable">
            <insurance-logic-table
                v-model="data.insuranceLogicTable"
                @input="errors.clear('insuranceLogicTable.0.dtRowId')"
            />
        </component-validation>

        <component-validation
            label="Brend avto"
            name="carBrandsTable"
            class="calculation-commission-section"
            :errors="errors"
            key="carBrandsTable">
            <u-dual-list
                :source="'administration/carBrands/selectOptions'"
                :columns="['code', 'name']"
                :data.sync="data.carBrandsTable"
                @change="errors.clear('carBrandsTable')"
            />
        </component-validation>

        <component-validation
            label="Ahentsiyi"
            name="agenciesTable"
            class="calculation-commission-section"
            :errors="errors"
            key="agenciesTable">
            <!--//:policy-filter-id.sync="agency_filter_policy_id"-->
            <u-dual-list :source="'administration/agencies/selectMultyOptions'"
                :columns="['code', 'name']"
                :data.sync="data.agenciesTable"
                @change="errors.clear('agenciesTable')"
            />
        </component-validation>

        <component-validation
            label="Produkty"
            name="productsTable"
            class="calculation-commission-section"
            :errors="errors"
            key="productsTable">
            <u-dual-list :source="'insuranceProduct/selectDualList'"
                :columns="['code', 'name']"
                :data.sync="data.productsTable"
                @change="errors.clear('productsTable')"
            />
        </component-validation>

        <div class="actions level is-mobile has-margin-top-large">
            <div class="level-left">
                <div class="level-item">
                    <button
                        @click="$router.go(-1)"
                        class="button is-primary">
                        <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                        <span class="icon"><fa icon="arrow-left"/></span>
                    </button>
                </div>
                <slot name="buttons" :data="data"/>
            </div>

            <div class="level-right">
                <div
                    class="button is-success"
                    @click="$emit('submit', data)">
                    <span class="is-hidden-mobile">
                        <slot name="submit-label">{{ i18n('Zberehty') }}</slot>
                    </span>
                    <span class="icon"><fa icon="check"/></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import ElementValidation from '@components/validations/ElementValidation'
    import ComponentValidation from '@components/validations/ComponentValidation'

    import UTable from '@components/UTable'
    import USearch from '@components/USearch'
    import UDualList from '@components/UDualList'
    import VueSwitch from '@enso-ui/switch/bulma'

    import CommissionTypesValues from '@pages/administration/calculationCommissions/components/СommissionTypesValues'
    import InsuranceLogicTable from '@pages/administration/calculationCommissions/components/InsuranceLogicTable'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            ElementValidation,
            ComponentValidation,
            UTable,
            USearch,
            UDualList,
            VueSwitch,

            CommissionTypesValues,
            InsuranceLogicTable,
        },

        props: {
            path: {
                type: String,
                default: null,
            },
            errors: {
                type: Object,
            },
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                init: false,
                data: {
                    id: null,
                    name: null,
                    description: null,
                    is_active: false,
                    commissionTypesValues: [],
                    insuranceLogicTable: [],
                    carBrandsTable: [],
                    agenciesTable: [],
                    productsTable: [],
                },
            };
        },

        created() {
            if (this.path) this.fetch();
        },

        methods: {
            fetch() {
                axios.get(this.path)
                    .then(({ data }) => {
                        this.data = data;
                        this.init = true;
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
        },
    };
</script>

<style lang="sass">
.calculation-commission
    &-section
        margin-bottom: calc(2.5rem - 0.75rem)
        .title
            margin-bottom: 0 !important
</style>
