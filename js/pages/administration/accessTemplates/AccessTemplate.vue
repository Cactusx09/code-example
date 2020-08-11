<template>
    <div v-if="init"
        class="access-template">
        <div class="columns">
            <div class="column field is-6-fulhd is-6-widescreen is-6-desktop is-12-tablet is-12-mobile">
                <element-validation
                    v-model="data.name"
                    label="Nazva shablona"
                    name="name"
                    placeholder="Vvedit nazvy shablona"
                    :errors="errors"
                />
            </div>

            <div class="column is-6">
                <div class="field">
                    <label
                        @click="data.is_active = !data.is_active"
                        class="label">
                        {{ i18n('Aktyvuvaty shablon') }}
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
            name="accessTemplateGrid"
            class="calculation-commission-section"
            :errors="errors"
            key="accessTemplateGrid">
            <u-table
                :template.sync="accessTemplateTemplate"
                :table.sync="data.accessTemplateGrid"
                :scroll="false"
                name="accessTemplateGrid">
                <template #rowToAdd_brand_policy_id="{ rowToAdd, column }">
                    <vue-select
                        v-model="rowToAdd.brand_policy_id.value"
                        :i18n="i18n"
                        @selection="selectionBrandModelPolicy($event, rowToAdd)"
                        :disabled="rowToAdd[column.refDisabled] && !rowToAdd[column.refDisabled].value"
                        v-bind="column.props"/>
                </template>
            </u-table>
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

    import AccessTemplate from './templates/AccessTemplate.js'

    import UTable from '@components/UTable'
    import { VueSelect } from '@enso-ui/select/bulma'
    import VueSwitch from '@enso-ui/switch/bulma'

    import ElementValidation from '@components/validations/ElementValidation'
    import ComponentValidation from '@components/validations/ComponentValidation'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            UTable,
            VueSelect,
            VueSwitch,
            ElementValidation,
            ComponentValidation,
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

        mixins: [
            errorHandler,
            AccessTemplate,
        ],

        data() {
            return {
                init: false,
                data: {
                    id: null,
                    data: {
                        id: null,
                        name: null,
                        description: null,
                        is_active: false,
                        accessTemplateGrid: [],
                    },
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
                        this.data = { ...data };
                        this.init = true;
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            selectionBrandModelPolicy(selection, rowToAdd) {
                rowToAdd.brand_policy_id.selection = selection;
                if (selection && selection.alias === 'all') {
                    this.accessTemplateTemplate.columns.brand_ids.refDisabled = false;
                    this.accessTemplateTemplate.columns.brand_ids.props.placeholder = 'Vsi modeli';
                    this.accessTemplateTemplate.columns.brand_ids.disabled = true;
                    rowToAdd.brand_ids.value = [];
                } else {
                    this.accessTemplateTemplate.columns.brand_ids.refDisabled = 'brand_policy_id';
                    this.accessTemplateTemplate.columns.brand_ids.props.placeholder = 'Oberit model';
                    this.accessTemplateTemplate.columns.brand_ids.disabled = false;
                }
            },
        },
    };
</script>
