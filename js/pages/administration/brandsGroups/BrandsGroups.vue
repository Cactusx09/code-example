<template>
    <div class="box form-box has-background-light raises-on-hover">
        <div class="columns">
            <div class="column is-6">
                <element-validation
                    v-model="data.name"
                    :label="'Nazva hrupy'"
                    :name="'name'"
                    :errors="errors"/>
            </div>

            <div class="column is-6">
                <div class="field">
                    <label
                        @click="data.is_active = !data.is_active"
                        class="label">{{ i18n('Aktyvuvaty hrupu') }}</label>
                    <vue-switch
                        v-model="data.is_active"
                        class="vue-switch is-large is-info"
                        size="is-large"
                        type="is-success"/>
                </div>
            </div>
        </div>

        <div class="columns">
            <element-validation class="column"
                :label="'Notes'"
                :name="'description'"
                :errors="errors">
                <textarea
                    v-model="data.description"
                    class="textarea"/>
            </element-validation>
        </div>

        <component-validation
            :label="'Brend ta model'"
            :name="'brandModelsTable'"
            :labelClass="'label'"
            :errors="errors">
            <u-table
                :template="productBrandModelsTemplate"
                :table.sync="data.brandModelsTable"
                :scroll="10"
                :name="'BrandModels'"
                @add-row="errors.clear('brandModelsTable')"
                ref="brandModelsTable">
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

        <div class="columns has-margin-top-large">
            <div class="column">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <button class="button is-primary"
                                @click="$router.go(-1)">
                                <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                                <span class="icon"><fa icon="arrow-left"/></span>
                            </button>
                        </div>

                        <div v-if="$route.params.brandsGroup"
                            class="level-item">
                            <router-link class="button is-info"
                                :to="{ name: 'administration.brandsGroups.create' }">
                                <span class="is-hidden-mobile">{{ i18n('Create') }}</span>
                                <span class="icon"><fa icon="plus"/></span>
                            </router-link>
                        </div>
                    </div>

                    <div class="level-right">
                        <div class="level-item">
                            <button class="button is-success"
                                @click="$emit('save', data)">
                                <span class="is-hidden-mobile">{{ i18n('save') }}</span>
                                <span class="icon"><fa icon="check"/></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import BrandModels from '@pages/administration/insuranceProducts/templates/BrandModels.js'

    import ElementValidation from '@components/validations/ElementValidation.vue'
    import ComponentValidation from '@components/validations/ComponentValidation.vue'

    import VueSwitch from '@enso-ui/switch/bulma'
    import UTable from '@components/UTable'
    import { VueSelect } from '@enso-ui/select/bulma'

    import Errors from '@enso-ui/forms/errors'

    export default {
        components: {
            ElementValidation,
            ComponentValidation,
            VueSwitch,
            UTable,
            VueSelect,
        },

        mixins: [BrandModels],

        inject: ['i18n'],

        props: {
            brandsGroupId: {
                type: Number,
                required: false,
            },
        },

        data() {
            return {
                data: {
                    name: null,
                    is_active: false,
                    description: null,
                    brandModelsTable: [],
                },
                errors: new Errors(),
            };
        },

        created() {
            if (this.brandsGroupId) this.fetch();
        },

        methods: {
            fetch() {
                axios.get(route('administration.brandsGroups.edit', this.brandsGroupId))
                    .then(({ data }) => {
                        this.data = data;
                        this.$nextTick(() => this.$refs.brandModelsTable.convertMultipleStructure());
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
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
        },
    };

</script>
