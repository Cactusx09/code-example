<template>
    <u-table
        v-if="ready"
        :template.sync="template"
        :table.sync="data"
        @input="updateTable($event)"
    />
</template>

<script>

import UTable from '@components/UTable'

const defaultProps = {
    meta: {
        sortable: true,
        replaceable: true,
        editable: {
            type: 'number',
            default: '0',
            round: 2,
            min: 0,
            max: 100,
        },
    },
    //class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
};

export default {
    components: {
        UTable,
    },

    props: {
        value: {
            type: Array,
            default: null,
        },
    },

    data() {
        return {
            ready: false,
            template: {
                search: false,
                rowToAdd: false,
                actions: false,
                columns: {},
            },
            data: [],
        };
    },

    watch: {
        value: {
            handler() {
                this.init();
            },
            immediate: true,
            deep: true,
        },
    },

    methods: {
        init() {
            if (!this.value.length) return;

            const { data, columns } = this.buildValue(this.value);

            this.template.columns = columns;
            this.data = [data];
            this.ready = true;
        },
        buildValue(data) {
            return data.reduce((result, item) => {
                result.columns[item.name] = {
                    label: item.column,
                    ...defaultProps,
                };

                result.data[item.name] = item.value;
                return result;
            }, {
                columns: {},
                data: {},
            });
        },
        updateTable({ row }) {
            const value = Object.entries(row).map(([name, value]) => ({ name, value }));
            this.$emit('input', value);
        },
    },
};
</script>
