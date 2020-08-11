<template>
    <div
        :class="[
            templateData.style,
            'utable-tr utable__rowtoadd',
        ]">
        <div
            v-for="(column, key) in templateData.columns"
            :class="[
                'utable-td column',
                `column_${key}`,
                templateData.columns[key].class,
                column.align ? templateData.aligns[column.align] : templateData.align,
            ]"
            :key="key">
            <slot
                :name="`rowToAdd_${key}`"
                :column="column"
                :row-to-add="data">
                <component
                    v-if="column.type"
                    :is="column.type"
                    :i18n="i18n"
                    v-model="data[key].value"
                    v-bind="column.props"
                    @input="$emit(`input-${_.kebabCase(key)}`, $event)"
                    @selection="
                        data[key].selection = $event;
                        $emit(`selection-${_.kebabCase(key)}`, $event);
                    "
                    :disabled="
                        column.refDisabled
                            ? !data[column.refDisabled].value
                            : column.disabled
                    "
                    :ref="key"/>

                <span v-else>
                    {{ data[key].value }}
                </span>
            </slot>
        </div>
        <div :class="[
            'utable-td column table-actions actions',
            templateData.align,
            templateData.actions.class
        ]">
            <div class="table-action-buttons">
                <slot
                    name="addButton"
                    :row-to-add="data"
                    :disabled="!addButtonState">
                    <button
                        :class="['button', { 'is-success': addButtonState }]"
                        @click="addRow()"
                        :disabled="!addButtonState">
                        <span class="icon">
                            <fa icon="plus-square" />
                        </span>
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma'
import UInput from '@components/UInput.vue'
import Uploader from '@components/Uploader.vue'
import { Datepicker } from '@enso-ui/datepicker/bulma'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPlusSquare,
    faTrashAlt,
    faSearch,
    faSort,
    faSortUp,
    faSortDown,
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faPlusSquare,
    faTrashAlt,
    faSearch,
    faSort,
    faSortUp,
    faSortDown,
)

export default {
    components: {
        VueSelect,
        UInput,
        Uploader,
        Datepicker,
    },

    inject: ['i18n'],

    props: {
        templateData: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            data: {},
        }
    },

    computed: {
        addButtonState() {
            let disabledColumnFlags = [];
            for (let key in this.templateData.columns) {
                const column = this.templateData.columns[key];
                const value = this.data[key].value;

                if (column.refDisabled) {
                    if (column.props && column.props.multiple) {
                        disabledColumnFlags.push(value.length > 0);
                    } else {
                        disabledColumnFlags.push(value === 0 || !!value);
                    }

                    if (column.type === 'Uploader') {
                        disabledColumnFlags[disabledColumnFlags.length - 1] = !!value;
                    }
                };

                // if (column.unique) {
                //     let checkForUniqueness = this.data.findIndex((item) => item[key] === value);

                //     if (checkForUniqueness >= 0) disabledColumnFlags.push(false);
                // }
            }
            return disabledColumnFlags.every((colFlag) => colFlag === true);
        },
    },

    created() {
        this.setDefaultValues();
    },

    methods: {
        addRow(row = this.data) {
            let addRow = _.clone(this.data);

            Object.entries(this.templateData.columns).forEach(([key, column]) => {
                if (column.type === 'VueSelect') {
                    addRow[key] = row[key].value;

                    const nameKey = column.name;

                    if (row[nameKey]) {
                        addRow[nameKey] = row[nameKey].value || row[nameKey];
                    } else {
                        let selection = row[key].selection;

                        if (column.props && column.props.multiple) {
                            addRow[nameKey] = [];

                            const id = column.props.trackBy || 'id';
                            const name = column.props.label || 'name';

                            selection.forEach((option) => {
                                addRow[nameKey].push({
                                    [id]: option[id],
                                    [name]: option[name],
                                });
                            });
                        } else {
                            let label = column.props.label || 'name';

                            addRow[nameKey] = _.get(selection, label);
                        }
                    }
                } else if (column.props && column.props.type === 'checkbox') {
                    addRow[key] = !!row[key].value;
                } else {
                    addRow[key] = row[key].value;
                }
                // if (index) this.templateData.columns[index].required = true;
            });

            this.$emit('add', addRow);
            // this.updateTable(table);
            this.setDefaultValues();
        },

        setDefaultValues() {
            Object.entries(this.templateData.columns).forEach(([key, column]) => {
                if (column.type === 'VueSelect' && column.props.multiple) {
                    this.$set(this.data, key, {
                        value: column.default || [],
                    });
                } else if (column.type === 'Uploader' ) {
                    this.$set(this.data, key, { value: column.default });
                    this.$nextTick(() => this.$refs[key][0].reset());
                } else {
                    this.$set(this.data, key, {
                        value: column.default,
                    });
                }
            });

            this.$emit('set-default-add', this.data);
        },
    },
}

</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"
.utable
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

</style>
