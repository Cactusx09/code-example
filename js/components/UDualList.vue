<template>
<div class="duallist">
    <div class="duallist__head">
        <div class="duallist__head_search">
            <input
                class="input"
                :placeholder="i18n('Vvedit dlya poshuku')"
                v-model="searchText"
                @focus="transition = 'listSearch'"
                @blur="transition = 'listLeft'"
                @keyup="search"/>
        </div>

        <div
            v-if="policyFilterId"
            class="duallist__head_policy buttons has-addons">
            <div
                v-for="(filter, index) in policyFilterArray"
                :key="index"
                @click="changePolicyFilter(filter.id)"
                :class="['button is-outline', {[`is-selected ${filter.style}`] : filter.id === policyActiveFilterId }]">
                {{ i18n(filter.name) }}
            </div>
        </div>
    </div>

    <div class="duallist__wrap">
        <transition-group
            :name="transition"
            class="duallist__left">
            <div
                v-for="(item, index) in listLeftSelected"
                :key="item.id"
                @click.exact="selectRow({ align: 'Left', selectedIndex: index })"
                @click.ctrl.exact="selectRow({ align: 'Left', selectedIndex: index, ctrl: true })"
                @dblclick.exact="moveRow({
                    item: item,
                    direction: {
                        from: 'listLeftSelected',
                        to: 'listRightSelected'
                    },
                    selectedIndex: index,
                })"
                @click.shift="selectRows({ align: 'Left', selectedIndex: index })"
                :class="['duallist__row columns', { '_active' : item.selected }]">
                <div
                    v-for="columnName in columns"
                    :key="`${columnName}_${item.id}`"
                    class="duallist__column">
                    {{ displayColumns(columnName, item) }}
                </div>
            </div>
        </transition-group>
        <div class="duallist__btns">
            <button
                class="button is-info is-outlined is-fullwidth"
                @click="moveAll({
                    from: 'listLeftSelected',
                    to: 'listRightSelected',
                })">
                <fa :icon="'angle-double-right'"/>
            </button>

            <button
                :disabled="!isListLeftSelected"
                @click="moveSelected({
                    from: 'listLeftSelected',
                    to: 'listRightSelected',
                })"
                class="button is-info is-fullwidth">
                <fa :icon="'angle-right'"/>
            </button>

            <button
                :disabled="!isListRightSelected"
                @click="moveSelected({
                    from: 'listRightSelected',
                    to: 'listLeftSelected',
                })"
                class="button is-info is-fullwidth">
                <fa :icon="'angle-left'"/>
            </button>

            <button
                class="button is-info is-outlined is-fullwidth"
                @click="moveAll({
                    from: 'listRightSelected',
                    to: 'listLeftSelected',
                })">
                <fa :icon="'angle-double-left'"/>
            </button>
        </div>
        <transition-group
            name="listRight"
            class="duallist__right">
            <div
                v-for="(item, index) in listRightSelected"
                :key="item.id"
                @click.exact="selectRow({ align: 'Right', selectedIndex: index })"
                @click.ctrl.exact="selectRow({ align: 'Right', selectedIndex: index, ctrl: true })"
                @dblclick.exact="moveRow({
                    item: item,
                    direction: {
                        from: 'listRightSelected',
                        to: 'listLeftSelected'
                    },
                    selectedIndex: index,
                })"
                @click.shift="selectRows({ align: 'Right', selectedIndex: index })"
                :class="['duallist__row columns', { '_active' : item.selected }]">
                <div
                    v-for="columnName in columns"
                    :key="`${columnName}_${item.id}`"
                    class="duallist__column">
                    {{ displayColumns(columnName, item) }}
                </div>
            </div>
        </transition-group>
    </div>
</div>
</template>
<script>
    import { library } from '@fortawesome/fontawesome-svg-core'
    import {
        faAngleRight,
        faAngleLeft,
        faAngleDoubleRight,
        faAngleDoubleLeft,
    } from '@fortawesome/free-solid-svg-icons';
    library.add([
        faAngleRight,
        faAngleLeft,
        faAngleDoubleRight,
        faAngleDoubleLeft,
    ])

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        inject: ['i18n'],

        mixins: [errorHandler],

        props: {
            source: {
                type: String,
                required: true,
            },
            data: {
                type: Array,
                default() {
                    return [];
                },
            },
            columns: {
                type: Array,
                default: ['id', 'name'],
            },
            policyFilterId: {
                type: Number,
            },
        },

        data() {
            return {
                listLeftSelected: [],
                listRightSelected: this.data,
                listLeftOrigin: null,
                prevSelectedItemLeft: null,
                prevSelectedItemRight: null,
                searchText: null,
                transition: 'listLeft',
                policyFilterArray: null,
                policyActiveFilterId: this.policyFilterId,
            }
        },

        computed: {
            isListLeftSelected() {
                return this.listLeftSelected.some((item) => item.selected);
            },
            isListRightSelected() {
                return this.listRightSelected.some((item) => item.selected);
            },
        },

        created() {
            this.getOptions();
        },

        methods: {
            getOptions() {
                axios.get(`/api/${this.source}?paginate=-1`)
                    .then(({ data }) => {
                        this.listRightSelected.forEach((itemRight) => {
                            const index = data.findIndex((dataItem) => dataItem.id === itemRight.id);
                            data.splice(index, 1);
                        });

                        this.listLeftSelected = data.map((item) => ({ ...item, selected: false}));
                        this.listRightSelected = this.listRightSelected.map((item) => ({ ...item, selected: false}));

                        if (this.policyFilterId) this.getFilterPolicy();
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
            getFilterPolicy() {
                axios.get(route('references.filterpolicies.selectOptions'))
                    .then(({ data }) => {
                        this.policyFilterArray = data;
                        this.changePolicyFilter(this.policyActiveFilterId);
                    })

                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            search() {
                let searchText = this.searchText;
                if (!searchText) {
                    this.listLeftSelected = this.listLeftOrigin ? this.listLeftOrigin : this.listLeftSelected;
                    this.listLeftOrigin = null;
                    return;
                }
                searchText = searchText.toLowerCase();
                this.listLeftOrigin = this.listLeftOrigin || this.listLeftSelected;
                this.listLeftSelected = this.listLeftOrigin.filter((row) => {
                    return this.columns.find((columnName) => {
                        return String(row[columnName]).toLowerCase().includes(searchText);
                    });
                });
            },

            selectRow({ align, selectedIndex, ctrl }) {
                this[`prevSelectedItem${align}`] = selectedIndex;

                this[`list${align}Selected`].forEach((item, itemIndex) => {
                    if (!ctrl) {
                        item.selected = selectedIndex === itemIndex;
                    } else if (selectedIndex === itemIndex) {
                        item.selected = !item.selected;
                    }
                });
            },
            selectRows({ align, selectedIndex }) {
                const prevSelectedIndex = this[`prevSelectedItem${align}`];

                this[`list${align}Selected`].forEach((item, itemIndex) => {
                    item.selected = prevSelectedIndex < selectedIndex
                        ? itemIndex >= prevSelectedIndex && itemIndex <= selectedIndex
                        : itemIndex >= selectedIndex && itemIndex <= prevSelectedIndex;
                });
            },

            moveRow({ item, direction: { from, to }, selectedIndex }) {
                this[to].push(item);

                this[from].splice(selectedIndex, 1);

                this.clearSelected(to);

                this.updateData();

                if (this.policyFilterId) this.reactivityPolicyFilter();
            },
            moveSelected({ from, to }) {
                let selectedItems = [];
                this[from] = this[from].filter((row) => {
                    if (row.selected) {
                        selectedItems.push(row);
                        return false;
                    }
                    return true;
                });

                this[to] = [...this[to], ...selectedItems];

                this.clearSelected(to);

                this.updateData();

                if (this.policyFilterId) this.reactivityPolicyFilter();
            },
            moveAll({ from, to }) {
                this[to] = [...this[to], ...this[from]];
                this[from] = [];

                this.clearSelected(to);

                this.updateData();

                if (this.policyFilterId) this.reactivityPolicyFilter();
            },
            clearSelected(target) {
                this[target].forEach((item) => item.selected = false);
            },

            updateData() {
                this.$emit('update:data', this.listRightSelected);
                this.$emit('change');
            },

            changePolicyFilter(currentId) {
                if (currentId === this.getPolicyFilterIdFromAlias('all')) {
                    this.moveAll({
                        from: 'listLeftSelected',
                        to: 'listRightSelected',
                    });
                }
                this.updatePolicyFilter(currentId);
            },

            updatePolicyFilter(currentId) {
                this.policyActiveFilterId = currentId;
                this.$emit('update:policy-filter-id', currentId);
            },

            reactivityPolicyFilter() {
                if (this.listLeftSelected.length === 0)
                    this.updatePolicyFilter(this.getPolicyFilterIdFromAlias('all'));

                if (this.policyActiveFilterId === this.getPolicyFilterIdFromAlias('all') && this.listLeftSelected.length > 0)
                    this.updatePolicyFilter(this.getPolicyFilterIdFromAlias('whitelist'));
            },

            getPolicyFilterIdFromAlias(currentAlias) {
                return this.policyFilterArray.find(({ alias }) => alias === currentAlias).id;
            },

            displayColumns(columns, item) {
                const displayColumn = columns.split('.')
                    .reduce((result, property) => result[property], item);

                return displayColumn;
            },
        },
    };
</script>
<style lang="sass" scoped>
    .duallist
        .columns
            margin: 0
        &__column
            padding-bottom: .5em
            padding-top: .5em
            &:nth-of-type(1)
                font-weight: 500
                font-size: .85em
                letter-spacing: .8px
                width: 75px
                text-align: center

        &__wrap
            display: flex
            align-items: stretch
            justify-content: space-between
        &__head
            display: flex
            margin-bottom: 1em
            justify-content: space-between
            &_search
                width: calc(50% - 36px)
            &_policy
                margin-left: auto
                width: calc(50% - 36px)

        &__left,
        &__right
            box-shadow: 0 2px 3px hsla(0,0%,4%,.1), 0 0 0 1px hsla(0,0%,4%,.1)
            background-color: #fff
            overflow: hidden
            width: calc(50% - 36px)
            min-height: 250px
            max-height: 384px
            overflow-y: auto
        &__btns
            padding: 1em
            margin-top: auto
            margin-bottom: auto
            button
                &:not(:last-of-type)
                    margin-bottom: 1rem

        &__row
            border-bottom: 1px solid  rgba(#dbdbdb, 0.5)
            cursor: pointer
            user-select: none
            padding-left: .5em
            padding-right: .5em
            align-items: center
            margin-bottom: -1px !important
            &._active
                background-color: #209cee !important
                color: #fff
            &:hover
                background-color: rgba(235, 235, 235, 0.59)
            &:nth-of-type(2n)
                background-color: rgba(235, 235, 235, 0.19)

    .listLeft
        &-enter-active,
        &-leave-active
            transition: all .3s
            max-height: 50px
        &-enter,
        &-leave-to
            opacity: 0
            transform: translateX(100px)
            max-height: 0

    .listSearch
        &-enter-active,
        &-leave-active
            transition: all .3s
            max-height: 50px
        &-enter,
        &-leave-to
            opacity: 0
            max-height: 0

    .listRight
        &-enter-active,
        &-leave-active
            transition: all .3s
            max-height: 50px
        &-enter,
        &-leave-to
            opacity: 0
            transform: translateX(-100px)
            max-height: 0
</style>
