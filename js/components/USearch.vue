<template>
<div
    class="u-search"
    v-click-outside="cancel">
    <slot :search-data="searchData"/>

    <div
        style="margin-bottom: 0.75rem;"
        class="dynamicsearch"
        v-if="initSearch"
        v-show="visible">
        <u-table
            v-if="state.template"
            :name="'TableSearch'"
            :template="{
                search: false,
                actions: false,
                columns: state.template.columns,
            }"
            :scroll="8"
            :table.sync="tableData">
            <template #0="{ row }">
                <div
                    v-if="checkbox"
                    class="control has-text-centered">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            name="dtRowId"
                            :value="row"
                            @click="addRow(row, $event)"/>
                    </label>
                </div>
                <div v-else
                    class="control has-text-centered">
                    <label class="radio">
                        <input type="radio"
                            name="dtRowId"
                            :value="row"
                            @click="addRow(row, $event)"/>
                    </label>
                </div>
            </template>
        </u-table>
        <div class="dynamicsearch__btns">
            <button
                class="button is-outlined"
                @click="cancel()">
                {{ i18n('Cancel') }}
            </button>
            <button
                class="button is-info"
                @click="accept()"
                :disabled="disabledAcceptButton">
                {{ i18n('Obraty') }}
            </button>
        </div>
    </div>
</div>
</template>

<script>
import UTable from '@components/UTable.vue'
import { clickOutside } from '@enso-ui/directives'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        UTable,
    },

    directives: { clickOutside },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        id: {
            type: String,
            default: 'dtRowId',
        },
        tableFilters: {
            type: Object,
            required: false,
        },
        tableSearch: {
            type: String,
            return: null,
        },
        apiUrl: {
            required: false,
        },
        minLength: {
            required: false,
            default: 0,
        },
        checkbox: {
            type: Boolean,
            return: false,
        },
        route: {
            type: String,
        },
        error: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            render: false,
            visible: false,
            searchData: [],
            tableData: [],
            state: {},
            disabledAcceptButton: true,
        }
    },

    computed: {
        path() {
            return this.apiUrl ? this.apiUrl : `/api/dynamicsearch/${this.route}/initTable`;
        },
        initSearch() {
            if (
                !this.error
                && (this.tableFilters || this.tableSearch && this.tableSearch.length >= this.minLength)
                && this.render
            ) {
                this.$nextTick(() => this.state.template ? this.getData() : this.initTable());
                return true;
            } else {
                this.visible = false;
                this.render = true;
                return false;
            }
        },
    },

    methods: {
        accept() {
            //if (this.route) this.$router.replace(`#${this.route}_id=${this.searchData[0].dtRowId}`);
            this.$emit('accept', this.searchData);
            this.reset();
        },
        cancel() {
            if (!this.initSearch) return;

            this.$emit('cancel');
            this.reset();
        },
        addRow(row, event) {
            if (!event.srcElement.checked) {
                let index = this.searchData.findIndex((searchRow) => searchRow[this.id] === row[this.id]);
                this.searchData.splice(index, 1);
            } else if (!this.checkbox) {
                this.searchData[0] = row;
            } else {
                this.searchData.push(row);
            }

            this.disabledAcceptButton = this.searchData.length === 0;
        },
        reset() {
            this.$emit('update:tableSearch', null);
            this.tableData = [];
            this.searchData = [];
            this.visible = false;
        },
        initTable() {
            axios.get(this.path)
                .then(({ data }) => {
                    data.template.columns.forEach((item) => {
                        if (item.name === 'dtRowId') {
                            item.class = 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile has-text-centered'
                        }
                        // if (item.meta.hidden || item.meta.rogue || !item.meta.visible) {
                        //     item.hidden = true;
                        // }
                    });
                    this.state = data;
                    this.getData();
                })
                .catch((error) => {
                    this.errorHandler(error);
                    this.visible = false;
                });
        },
        getData() {
            axios.get(this.state.template.readPath, {
                    params: {
                        columns: this.requestColumns(),
                        filters: this.tableFilters,
                        meta: this.trimNeutrals({
                            start: this.state.meta.start,
                            length: this.state.meta.length,
                            sort: this.state.meta.sort,
                            search: this.tableSearch,
                            comparisonOperator: this.state.meta.comparisonOperator,
                            fullInfoRecordLimit: this.state.meta.fullInfoRecordLimit,
                        }),
                    },
                })
                .then(({ data }) => {
                    this.tableData = data.data;
                    this.visible = data.data.length > 0;
                })
                .catch((error) => {
                    this.visible = false;
                });
        },
        requestColumns() {
            return Object.values(this.state.template.columns).map((column) => {
                return {
                    label: column.label,
                    name: column.name,
                    data: column.data,
                    meta: this.trimNeutrals({
                        searchable: column.meta.searchable,
                        sortable: column.meta.sortable,
                        sort: column.meta.sort,
                        rogue: column.meta.rogue,
                    }),
                }
            });
        },
        trimNeutrals(meta) {
            Object.keys(meta).forEach((key) => {
                if (meta[key] === false || meta[key] === null) {
                    delete meta[key];
                }
            });
            return meta;
        },
    },
}
</script>

<style lang="sass">

.u-search
    width: 100%
    position: relative
    .table
        td, th
            &:first-of-type
                width: 33px
    .dynamicsearch
        position: absolute
        z-index: 99
        left: 1px
        top: 100%
        margin-top: 8px
        background-color: #fff
        padding: 15px 10px
        box-shadow: 0 8px 8px hsla(0,0%,4%,.1)
        border-radius: 5px
        border: 1px solid #209cee
        min-width: 380px
        width: 900px
        max-width: 90vw
        z-index: 5
        &:before
            content: ''
            position: absolute
            display: inline-block
            top: -8px
            left: 15px
            width: 0
            height: 0
            border-style: solid
            border-width: 0px 10px 8px 10px
            border-color: transparent transparent #209cee transparent
            z-index: -1
        .title
            font-size: .95em
            display: flex
            align-items: center
            span
                margin-right: 10px
        &__btns
            display: flex
            justify-content: flex-end
            margin-top: .75rem
            .button
                font-size: .85rem
                &.is-info
                    margin-left: 5px
        div.table-bottom-controls
            margin-top: 0
        .has-padding-bottom-large
            padding-bottom: 6px
        .column
            &.is-half
                width: 100% !important

</style>
