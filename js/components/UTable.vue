<template>
<div v-if="templateData.rowToAdd || data.length > 0"
    :class="[
        'utable',
        { 'is-collapsable': isCollapsable },
    ]">
    <div v-if="templateData.search || searchText"
        class="columns search-filter">
        <div :class="['column', templateData.search.class ? templateData.search.class : 'is-4']">
            <p class="control has-icons-left has-icons-right">
                <input
                    type="text"
                    class="input"
                    v-model="searchText"
                    @input="searchFilter()"
                    :placeholder="i18n('Search')">
                <span class="icon is-small is-left">
                    <fa icon="search"/>
                </span>
                <span
                    class="icon is-small is-right clear-button"
                    v-if="searchText"
                    @click="
                        searchText = '';
                        searchFilter();
                    ">
                    <a class="delete is-small"/>
                </span>
            </p>
        </div>
    </div>
    <div :class="[
        'table-responsive',
        { 'table-scroll': hasScroll },
    ]">
        <div class="table-header">
            <table :class="['utable__table is-fullwidth vue-data-table', templateData.style]">
                <slot
                    name="thead"
                    :template="template">
                    <div :class="[templateData.style, 'utable-tr utable-thead']">
                        <div v-for="(column, key) in templateData.columns"
                            :key="key"
                            :align="column.align ? templateData.aligns[column.align] : 'has-text-center'"
                            :class="[
                                'utable-th column',
                                `column_${key}`,
                                column.class,
                            ]">
                            <slot
                                :name="`th_${key}`"
                                :column="column">
                                <div class="level">
                                    <span
                                        @click="column.meta.sortable ? toggleSort($event, key, column) : false"
                                        :class="{ '_sortable': column.meta.sortable }">

                                        <span v-if="column.refConcats">
                                            <span
                                                v-for="(columnName, keyIndex) in column.label"
                                                :key="keyIndex">
                                                {{ i18n(columnName) }} {{ keyIndex !== column.label.length - 1 ? ' /' : '' }}
                                            </span>
                                        </span>

                                        <span
                                            v-else
                                            v-html="i18n(column.label)"/>

                                        <span
                                            v-if="column.meta.sortable"
                                            class="icon is-small">
                                            <fa :icon="sortIcon(column.meta.sort)" size="xs"/>
                                        </span>
                                    </span>

                                    <a
                                        v-if="column.meta.sort"
                                        @click="clearColumnSort(column, key)"
                                        class="delete is-small"/>
                                </div>
                            </slot>
                        </div>
                        <div
                            v-if="templateData.actions"
                            :class="['utable-th column actions', templateData.align, templateData.actions.class]">
                            {{ i18n(templateData.labels.actions) }}
                        </div>
                    </div>
                </slot>

                <row-to-add
                    v-if="templateData.rowToAdd"
                    :template-data="templateData"
                    v-on="$listeners"
                    @add="addRow($event)"
                    ref="rowToAdd">
                    <template
                        v-for="(_, name) in $scopedSlots"
                        :slot="name"
                        slot-scope="slotData">
                        <slot :name="name" v-bind="slotData"/>
                    </template>
                </row-to-add>
            </table>
        </div>
        <div
            class="table-body"
            :style="{ 'max-height': scroll && data.length >= scroll ? `${rowHeight * scroll}px` : 'auto' }">
            <div v-if="data.length > 0"
                :class="[
                    'utable__table is-fullwidth vue-data-table',
                    templateData.style,
                ]"
                ref="tableBody">
                <transition-group name="utable-tr-transition" tag="div">
                    <template
                        v-for="(row, index) in data"
                        @click="$emit('row-click', index)">
                        <slot
                            :name="`tr_${index}`"
                            :index="index"
                            v-if="!row.isHidden"
                            :row="row">
                            <div :key="row.rowId"
                                :class="[
                                    'utable-tr',
                                    { 'is-active': row.isActive },
                                    { 'is-disabled': row.checkbox && !row.checkbox.enabled },
                                    { 'is-checked': row.checkbox && row.checkbox.value },
                                    { 'is-expanded': row.expanded },
                                    { 'has-background-primary': row[templateData.highlighted] },
                                    row.customClass,
                                ]">
                                <div
                                    v-for="(column, key) in templateData.columns"
                                    :key="key"
                                    :class="[
                                        'utable-td column',
                                        `column_${key}`,
                                        column.align ? templateData.aligns[column.align] : templateData.align,
                                        column.class,
                                        { 'compare': key === row['colors'] },
                                    ]"
                                    :data-label="column.label && i18n(column.label).replace(/<\/?[^>]+(>|$)/g, '')">
                                    <slot
                                        :name="key"
                                        :row="row"
                                        :column="column"
                                        :index="index">
                                        <span
                                            v-if="column.meta.boolean"
                                            :class="[row[key] ? 'is-success' : 'is-danger', 'tag is-table-tag']">
                                            <span class="icon is-small">
                                                <fa :icon="row[key] ? 'check' : 'times'"/>
                                            </span>
                                        </span>
                                        <span
                                            v-else-if="column.refConcats"
                                            class="tags">
                                            <span class="tag">
                                                {{ row[key] }}
                                            </span>
                                            <span
                                                v-for="(fieldName, key) in column.refConcats"
                                                :key="key" class="tag">
                                                {{ row[fieldName] }}
                                            </span>
                                        </span>
                                        <u-input
                                            v-else-if="column.meta.editable"
                                            v-model="row[key]"
                                            v-bind="column.meta.editable"
                                            @input="$emit('input', { row, column })"
                                            :i18n="i18n"/>
                                        <span
                                            v-else-if="templateData.columns[key].props && templateData.columns[key].props.multiple"
                                            class="tags">
                                            <span
                                                v-for="(tag, index) in row[templateData.columns[key].name]"
                                                :key="index"
                                                class="tag">
                                                {{ tag[templateData.columns[key].props.label || 'name'] }}
                                            </span>
                                        </span>

                                        <span v-else v-html="
                                            templateData.columns && templateData.columns[key].name
                                                ? row[templateData.columns[key].name]
                                                : row[key] && typeof row[key] !== undefined
                                                    ? row[key]
                                                    : ''
                                        ">
                                        </span>
                                    </slot>
                                </div>

                                <div v-if="isCollapsable"
                                    class="utable-td column collapsable-button is-paddingless"
                                    @click="$set(row, 'expanded', !row.expanded)">
                                    <span class="icon">
                                        <fa icon="chevron-right"/>
                                    </span>
                                </div>

                                <div v-if="templateData.actions"
                                    :class="[
                                        'utable-td column actions table-actions',
                                        templateData.align,
                                        templateData.actions.class,
                                    ]">
                                    <span class="table-action-buttons">
                                        <slot
                                            name="actions"
                                            :row="row"
                                            :index="index"/>
                                        <button
                                            v-if="templateData.actions.remove"
                                            class="button is-small is-table-button is-danger"
                                            @click="deletableRow = index">
                                            <span class="icon is-small">
                                                <fa icon="trash-alt" />
                                            </span>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </slot>
                    </template>
                </transition-group>
            </div>
        </div>

    </div>
    <confirm-modal :visible.sync="deletableRow"
        title="Vydalyty zapys?"
        @submit="commitRemove()">
    </confirm-modal>
</div>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma'
import ConfirmModal from '@components/ConfirmModal'
import UInput from '@components/UInput.vue'

import RowToAdd from '@components/RowToAdd.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faChevronRight,
    faPlusSquare,
    faTrashAlt,
    faSearch,
    faSort,
    faSortUp,
    faSortDown,
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faChevronRight,
    faPlusSquare,
    faTrashAlt,
    faSearch,
    faSort,
    faSortUp,
    faSortDown,
)

import { mapState } from 'vuex'

export default {
    components: {
        VueSelect,
        ConfirmModal,
        UInput,

        RowToAdd,
    },

    inject: ['i18n'],

    props: {
        template: {
            type: Object,
        },
        table: {
            type: Array,
        },
        scroll: {
            type: [Number, Boolean],
            default: 10,
        },
        search: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            data: [],
            rowHeight: null,
            deletableRow: null,
            tableOrigin: [],
            sorted: [],
            modifier: [],
            searchText: null,
            templateData: {
                styles: {
                    bordered: 'is-bordered',
                    compact: 'is-narrow',
                    hover: 'is-hoverable',
                    striped: 'is-striped',
                },
                highlighted: null,
                align: 'has-text-left',
                style: 'is-striped is-hoverable is-bordered',
                aligns: {
                    center: 'has-text-centered',
                    left: 'has-text-left',
                    right: 'has-text-right',
                },
                search: this.search,
                rowToAdd: false,
                customRowToAdd: false,
                multiple: true,
                actions: {
                    remove: true,
                    class: 'is-12-mobile'
                },
                labels: {
                    actions: '',
                },
                ...this.template,
            },
            isCollapsable: false,
        };
    },

    watch: {
        table: {
            handler() {
                this.fetch();
            },
            immediate: true,
            deep: true,
        },
    },

    created() {
        // this.updateTemplate(this.templateData)

        if (this.templateData.rowToAdd) {
            if (this.templateData.isMultipleSelectConvertStructure) this.convertMultipleStructure();

            // this.rowToAddDefaultValues();
        }
        window.addEventListener('resize', this.onResize());
    },

    computed: {
        hasScroll() {
            return this.scroll && this.data.filter(row => !row.isHidden).length >= this.scroll;
        },
        ...mapState('layout', ['isMobile', 'isTablet']),
    },

    methods: {
        fetch() {
            this.data = this.initTableData();
            this.tableOrigin = this.data;

            if (this.data.length > 0) {
                this.$nextTick(() => {
                    this.rowHeight = this.$el.querySelector('.table-body .utable-tr').clientHeight + 1;
                });
            }
        },
        convertMultipleStructure() {
            Object.entries(this.templateData.columns).forEach(([key, column]) => {
                if (column.type === 'VueSelect' && column.props.multiple) {
                    this.data.forEach((tableRow) => {
                        this.$set(tableRow, column.name, tableRow[key]); // Objects 'id' and 'name' variables for view in table !important sequence
                        this.$set(tableRow, key, tableRow[key].map((option) => option[column.props.trackBy || 'id'])); // Array storage 'id' for database
                    });
                }
            });
        },
        initTableData() {
            return this.table.map((row, index) => {
                row.rowId = index;
                return row;
            });
        },

        updateTable() {
            this.$emit('update:table', this.data);
        },
        updateTemplate(template) {
            this.$emit('update:template', template);
        },

        addRow(addRow) {
            addRow.rowId = this.data.length > 0 ?
                _.maxBy(this.data, row => row.rowId).rowId + 1
                : 0;

            const replaceableRowIndex = this.getReplaceableRowTableIndex(addRow);

            if (replaceableRowIndex >= 0) {
                this.data.splice(replaceableRowIndex, 1, addRow);
            } else {
                this.data.unshift(addRow);
            }

            this.updateTable();

            this.$emit('add-row', { index: replaceableRowIndex, rowToAdd: addRow });
            // this.updateTable(table);
            // this.rowToAddDefaultValues();
        },
        getReplaceableRowTableIndex(addRow) {
            let replaceRowFlags = [],
                replaceableRowIndex = -1;

            this.data.some((row, index) => {
                for (let key in this.templateData.columns) {
                    if (this.templateData.columns.hasOwnProperty(key)) {
                        const column = this.templateData.columns[key];

                        if (column.meta.replaceable) replaceRowFlags.push(row[key] === addRow[key]);
                    }
                }

                if (replaceRowFlags.length > 0 && replaceRowFlags.every((rowFlag) => rowFlag === true)) {
                    replaceableRowIndex = index;
                    return true;
                }
                replaceRowFlags = [];
            });

            return replaceableRowIndex;
        },

        commitRemove() {
            const deletableRowIndex = this.deletableRow;
            this.$emit('remove-row', deletableRowIndex);

            this.deletableRow = null;
            this.$nextTick(() => {
                this.data.splice(deletableRowIndex, 1);
                this.tableOrigin = this.data;
                this.updateTable();
            });
        },

        searchFilter() {
            if (this.searchText) {
                // searchText = searchText.includes(',') ?
                //     searchText.replace(",", ".") :
                //     searchText.toLowerCase();

                let keysSearchableColumnsArr = [];
                Object.entries(this.templateData.columns).forEach(([key, column]) => {
                    if (column.meta.searchable) {
                        if (column.type === 'VueSelect') {
                            keysSearchableColumnsArr.push(column.name);
                        } else {
                            keysSearchableColumnsArr.push(key);
                        }
                    }
                });

                this.data.forEach((row) => {
                    const isFindedResult = keysSearchableColumnsArr.some((key) => {
                        return String(row[key]).toLowerCase().includes(this.searchText.toLowerCase());
                    });

                    row.isHidden = !isFindedResult;
                });
            } else {
                this.data.forEach(row => row.isHidden = false);
            }
        },

        sortIcon(sort) {
            if (!sort) return faSort;

            return sort === 'asc' ? faSortUp : faSortDown;
        },
        toggleSort(event, key, column) {
            const { sort } = column.meta;

            if (!event.shiftKey) this.clearSort();

            column.meta.sort = sort === 'asc' ? 'desc' : 'asc';

            const index = this.sorted.indexOf(key);

            if (!event.shiftKey) {
                this.sorted = [key];
                this.modifier = [column.meta.sort];
            } else {
                if (index > -1) {
                    this.$set(this.sorted, index, key);
                    this.$set(this.modifier, index, column.meta.sort);
                } else {
                    this.sorted.push(key);
                    this.modifier.push(column.meta.sort);
                }
            }

            this.data = _.orderBy(this.table, this.sorted, this.modifier);
        },
        clearSort() {
            Object.values(this.templateData.columns).forEach((column) => {
                column.meta.sort = null;
            });
        },
        clearColumnSort(column, key) {
            column.meta.sort = null;

            this.sorted.splice(this.sorted.indexOf(key), 1);
            this.modifier.splice(this.sorted.indexOf(key), 1);
            // this.updateTable(this.tableOrigin);
            this.data = this.tableOrigin;
        },

        setActiveRow(rowIndex) {
            this.data.forEach((row, index) => {
                this.$set(this.data[index], 'isActive', index === rowIndex);
            });
        },
        getRowToAdd(fieldName) {
            if (fieldName) {
                return this.$refs.rowToAdd.data[fieldName];
            }

            return this.$refs.rowToAdd.data;
        },

        onResize() {
            const isDesktop = window.innerWidth > 1024 && window.innerWidth < 1216;

            Object.values(this.templateData.columns).forEach((column) => {
                if (!column.class || !column.class.includes('is-collapsable')) return;

                if (column.class.includes('is-12-desktop') && isDesktop
                    || column.class.includes('is-12-mobile') && this.isMobile
                    || column.class.includes('is-12-tablet') && this.isTablet
                ) {
                    this.isCollapsable = true;
                }
            });
        },
    },
}

</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"
=responsive
    &.is-12-desktop
        +desktop-only
            @content
    &.is-12-tablet
        +tablet-only
            @content
    &.is-12-mobile
        +mobile
            @content
.utable
    .control.has-icons-right .icon
        pointer-events: all
    &.is-collapsable
        .table-header
            +mobile
                display: flex
        .utable
            &-tr
                padding-left: 22px
                &.is-active
                    .utable-td
                        &.collapsable-button
                            border-left: 1px solid #209cee

                &.is-expanded
                    border-bottom: 1px solid #dbdbdb
                    margin-bottom: 0
                    .utable-td
                        &.collapsable-button
                            .icon
                                transform: rotate(90deg)
                        +responsive
                            border-top: 1px solid rgba($grey-lighter, 0.7) !important
                            border-right: 1px solid rgba($grey-lighter, 0.7)
                            display: flex
                    &.is-active
                        .utable-td
                            +responsive
                                &::before
                                    color: $grey-darker
            &-th
                +responsive
                    display: none
            &-td
                &.collapsable-button
                    order: -1
                    max-width: 22px
                    margin-left: -23px
                    border-right: 1px solid #dbdbdb
                    .icon
                        transition: transform 0.5s
                +mobile
                    &::before
                        display: none
                &.is-collapsable
                    +mobile
                        &::before
                            display: flex
                    +responsive
                        display: flex
                        justify-content: flex-start
                        align-items: center
                        padding: 0.35rem 0.7rem
                        border-top: none
                        border-bottom: none !important
                        order: 5
                        width: calc(100% + 22px)
                        margin-left: -22px
                        display: none
                        &::before
                            content: attr(data-label) ':'
                            font-size: .86em
                            text-align: left
                            font-weight: 700
                            transition: 0.3s
                            margin-right: 0.5rem
                &.actions
                    justify-content: center
                    align-items: center
                    order: 0
                    display: flex
                    .table-action-buttons
                        +mobile
                            flex-direction: column
                            >:not(:last-child)
                                margin-right: 0
                                margin-bottom: 8px

    .table-header
        .utable-tr
            margin-bottom: 0
        +mobile
            .utable-thead
                display: none
            .utable__rowtoadd
                background: rgba(#23d160, 0.1)
                .utable-td
                    &::before
                        display: none

    &__table
        width: 100%
        textarea
            height: 2.25em
        .utable
            &-tr
                display: flex
                flex-wrap: wrap
                border-top: 1px solid #dbdbdb
                border-left: 1px solid #dbdbdb
                border-right: 1px solid #dbdbdb
                margin-bottom: -1px
                width: 100%
                // &:first-of-type
                //     border-top: none
                =stripe($color)
                    padding-left: 1.3rem
                    position: relative
                    // justify-content: flex-start
                    span::before
                        content: ''
                        position: absolute
                        left: 0
                        top: 0
                        height: 100%
                        width: .7rem
                        background-color: $color
                        border-right: 1px solid $grey-lighter
                &.blue
                    >.utable-td:first-of-type
                        +stripe($blue)
                &.green
                    >.utable-td:first-of-type
                        +stripe($green);
                &.yellow
                    >.utable-td:first-of-type
                        +stripe($yellow)
                &.orange
                    >.utable-td:first-of-type
                        +stripe($orange)
                &.red
                    >.utable-td:first-of-type
                        +stripe($red)
                &.violet
                    >.utable-td:first-of-type
                        +stripe($purple)
                &.white
                    >.utable-td:first-of-type
                        +stripe($white)
                &.grey
                    >.utable-td:first-of-type
                        +stripe($grey)

                &.is-disabled
                    background: rgba(#e74c3c, 0.1) !important
                    .tag
                        background: #fff
                        &.is-danger
                            background: $red
                &.is-checked
                    background: rgba(#23d160, 0.1) !important
                    .tag
                        background: #fff
                        hr
                            background: $grey-lighter
                        &.is-danger
                            background: $red

                &.is-active
                    font-weight: 700
                    color: #209cee
                    background: rgba(#209cee, 0.1)
                    border: 1px solid #209cee
                    z-index: 2
                    position: relative
                    >td
                        // border-top: 1px solid #209cee !important
                        // border-bottom: 1px solid #209cee !important
                        // margin-bottom: -1px
                        // &:first-of-type
                        //     border-left: 1px solid #209cee
                        // &:last-of-type
                        //     border-right: 1px solid #209cee
                    .is-checkradio + label
                        &:before
                            background: #fff
                    .dropdown-trigger .field
                        color: #209cee
                        font-weight: 700
                    .tag
                        border: 1px solid rgba(#209cee, 0.3)
                        color: #209cee
                        font-weight: 700
                        background: #fff
                        hr
                            background: $grey-lighter
                        &.is-danger
                            background: $red
                            color: #ffffff

                &:not(.utable__rowtoadd):hover
                    background: #fafafa

                +mobile
                    border-bottom: 1px solid #dbdbdb

                transition: opacity 1s, max-height 1s, background .2s
                &-transition
                    &-enter-to
                        background: rgba(#23d160, 0.2) !important
                        max-height: 100px
                    &-leave-active
                        background: rgba(#e74c3c, 0.2) !important
                        max-height: 100px
                    &-enter,
                    &-leave-to
                        max-height: 0
                        overflow: hidden
                        opacity: 0

            .tag
                border: 1px solid transparent
            &-td,
            &-th
                display: flex
                align-items: center
                flex-wrap: wrap
                padding: .5em .75em
                border-bottom: 1px solid #dbdbdb
                &:not(:first-of-type)
                    border-left: 1px solid #dbdbdb
                &.actions
                    justify-content: center
                    padding-top: 0.5rem
                    padding-bottom: 0.7rem
                    &.is-12-mobile
                        +mobile
                            font-size: 0.9rem
                    .button.is-small
                        font-size: .65rem
            &-th
                font-size: .8rem
                justify-content: center
                text-align: center
                color: #363636
                font-weight: 700
            &-td
                position: relative
                justify-content: flex-start
                &.has-text-centered
                    justify-content: center
                .number_type
                    .dropdown-menu
                        min-width: 0
                    .column
                        &:first-of-type
                            padding-right: .3rem
                        &:last-of-type
                            padding-left: .3rem
                +responsive
                    border-left: none !important
                    display: flex
                    justify-content: flex-start
                    align-items: center
                    border-top: none
                    order: 5
                    border-bottom: none !important
                    &::before
                        content: attr(data-label) ':'
                        font-size: .86em
                        text-align: left
                        font-weight: 700
                        transition: 0.3s
                        margin-right: 0.5rem
                    &.actions
                        justify-content: center
                        &:before
                            display: none
                +mobile
                    // background-color: #fff
                    width: 100%
                    padding: 0.25rem 0.5rem
                    border-bottom-color: rgba($grey-lighter, 0.5)
                    &:not(.actions)::before
                        content: attr(data-label) ':'
                        font-size: .86em
                        text-align: left
                        font-weight: 700
                        transition: 0.3s
                        margin-right: 0.5rem
                        margin-top: 0.25rem
                        margin-bottom: 0.25rem
                    &.actions
                        padding-left: 0
                        padding-right: 0
                        &.is-12-mobile
                            .button
                                font-size: 1rem

    .table-actions
        .table-action-buttons
            display: inline-flex
            >:not(:last-child)
                margin-right: 8px
            +widescreen-only
                >:not(:last-child)
                    margin-right: 5px
            +desktop-only
                flex-direction: column
                >:not(:last-child)
                    margin-right: 0
                    margin-bottom: 8px
            +tablet-only
                flex-direction: column
                >:not(:last-child)
                    margin-right: 0
                    margin-bottom: 8px
            +mobile
                flex-direction: row
                >:not(:last-child)
                    margin-right: 5px

    .is-checkradio[type=checkbox]+label,
    .is-checkradio[type=radio]+label
        display: block
        padding: 0
        margin: 0
        height: 1.52rem
        width: 1.55rem
        outline: none !important
        &:before
            width: 100%
            height: 100%
            background: #fff
        &:after
            top: 0.25rem
            width: 0.425rem
            height: 0.68rem

    // th.vue-table-header
    //     .level
    //         justify-content: center
    //     span
    //         white-space: normal
    //         &._sortable
    //             cursor: pointer
    //             user-select: none
    &__rowtoadd
        background: #f9f9f9

        .input[disabled],
        .vue-select[disabled],
        .textarea[disabled]
            border-color: #e7e7e7
            .icon.angle
                opacity: .5

        .textarea
            min-height: 60px
            font-size: .85rem
            padding: .5rem .625rem
        &_file
            flex-direction: column
            height: auto
            span
                order: 2
            form
                .icon
                    margin-left: 0 !important
                    margin-right: 0 !important
                path
                    fill: #fff



.table-responsive
    position: relative
    display: block
    width: 100%
    min-height: 0.01%
    overflow: visible !important
    .utable__table
        font-size: .8rem

div.table-bottom-controls
    margin-top: 0.5rem

div.no-records-found
    margin-top: 20px

div.table-crt-no
    white-space: nowrap
    display: flex
    .crt-no-label
        margin: auto

.hidden-controls
    cursor: pointer
    margin-left: auto
    margin-top: 0.1em

li.child-row:not(:last-child)
    border-bottom: 1px solid #efefef

li.child-row
    padding: 0.5em 0

.table-scroll
    > .table-body
        max-height: 300px
        overflow-x: hidden
        overflow-y: auto
        border-bottom: 1px solid #dbdbdb
        +mobile
            max-height: 90vh
        // table
        //     width: calc(100% + 17px) // TODO: scroll width fixes when user agent is not mobile

    .table-header
        // border: 1px solid #dbdbdb
        position: relative
        z-index: 3
        +widescreen-only
            .actions
                padding-right: 16px

    +widescreen-only
        .table-actions
            padding-right: 16px

    // table
    //     margin-bottom: 0
    //     th
    //         border-top: none
    //         border-bottom: none
    //         &:first-of-type
    //             border-left: none
    //         &:last-of-type
    //             border-right: none
    //     tr:first-of-type
    //         > td
    //             border-top: none

</style>
