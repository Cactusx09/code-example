<template>
    <vue-table
        :id="$attrs.id || 'table'"
        :path="path"
        :filters="filtersData"
        :error-handler="errorHandler"
        :i18n="i18n"
        class="box is-paddingless raises-on-hover"
        v-bind="$attrs"
        v-on="$listeners"
        @ready="ready = true"
        ref="vuetable">
        <template v-slot:[slot]="props"
            v-for="slot in scopedSlots">
            <slot
                :name="slot"
                :selected="selected"
                v-bind="props">
                <router-link
                    v-if="slot == 'edit'"
                    :to="edit ? routeData(props.row) : customEdit(props.row)"
                    class="button is-small is-table-button is-row-button">
                    <span class="icon is-small"><fa class="fa" icon="pencil-alt"/></span>
                </router-link>

                <span
                    v-else-if="slot == 'product_code'"
                    class="is-clickable tag is-table-tag"
                    @click="getSearch(props)">
                    {{ props | rowValue }}
                </span>

                <span
                    v-else
                    :class="[
                        'is-clickable',
                        selected[props.column.data] ? 'tag is-link is-table-tag' : 'has-text-link'
                    ]"
                    @click="getFilter(props)"
                >
                    <slot
                        :name="`filter_${props.column.name}`"
                        :row="props.row">
                        {{ props | rowValue }}
                    </slot>
                </span>
            </slot>
        </template>
    </vue-table>
</template>

<script>
import { VueTable } from '@enso-ui/tables/bulma';

export default {
    inject: ['errorHandler', 'i18n'],

    components: { VueTable },

    props: {
        path: {
            type: String,
            default() {
                return `/${`api/${this.$route.path}/initTable`
                    .split('/').filter(v => v).join('/')}`;
            },
        },
        edit: {
            type: Object,
            default: null,
        },
        filters: {
            type: Object,
            default: null,
        },
        customEdit: {
            type: Function,
            default: () => '',
        },
    },

    data: () => ({
        ready: false,
        selected: {},
        customFilters: {},
    }),

    computed: {
        scopedSlots() {
            return this.ready
                ? this.$refs.vuetable.scopedSlots
                : [];
        },
        filtersData() {
            const filters = this.customFilters;
            const filtersData = { ...this.filters };

            for (let key in filters) {
                filtersData[key] = { ...filtersData[key], ...filters[key] };
            }

            return filtersData;
        },
    },

    methods: {
        getFilter(props) {
            const { column: { name, data }, row } = props;

            const validate = [undefined, null].some(type => type === this.selected[data]);
            const value = validate ? row[name] : null;

            this.selected[data] = value;
            this.customFilters = {
                ...this.customFilters,
                ...this.getFilterParams(data, value),
            };
        },
        getFilterParams(data, value) {
            return data.split('.')
                .reverse()
                .reduce((result, property) => ({ [property]: result }), value);
        },

        routeData(row) {
            return {
                name: this.edit.name || this.$route.name.split('.').splice(-1, 1, 'edit').join('.'),
                params: this.getParams(row),
            };
        },
        getParams(row, params = this.edit.params) {
            return Object.keys(params)
                .reduce((result, key) => ({ ...result, [key]: row[params[key]] }), {});
        },

        getSearch(props) {
            const refCoreTable = this.$refs.vuetable.$refs.table;
            const value = !refCoreTable.state.meta.search ? this.$options.filters.rowValue(props) : '';

            this.$emit(`${props.column.name}`, value);

            refCoreTable.state.meta.search = value;
            refCoreTable.filterUpdate();
        },
        fetch() {
            return this.ready
                ? this.$refs.vuetable.fetch()
                : null;
        },
    },
    filters: {
        rowValue(props) {
            const value = props.row[props.column.name];
            return value;
        },
    },
};
</script>

<style lang="sass" scoped>
    .tag.is-clickable
        font-weight: bold
</style>
