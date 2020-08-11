<template>
    <div class="box">
        <div class="has-padding-top-large">
            <u-table
                :template.sync="agentCommissionBrandsTemplate"
                :table.sync="data.agentCommissionBrandsTable"
                :scroll="10"
                ref="agentCommissionBrands"
                @add-row="
                    blockTableRowToAdd();
                    $nextTick(() => disableFieldsRowToAdd());
                "
                @remove-row="$nextTick(() => blockTableRowToAdd())"
            />
        </div>

        <div class="columns has-margin-top-large">
            <div class="column">
                <div class="level-right">
                    <button
                        class="button is-success"
                        @click="save()">
                        <span class="is-hidden-mobile">{{ i18n('Save') }}</span>
                        <span class="icon"><fa icon="check"/></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import AgentCommissionBrands from '@pages/administration/agencies/templates/AgentCommissionBrands.js'

    import UTable from '@components/UTable'
    import { VueSelect } from '@enso-ui/select/bulma'

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            UTable,
            VueSelect,
        },

        mixins: [
            AgentCommissionBrands,
            errorHandler,
        ],

        inject: ['i18n'],

        props: {
            params: {
                type: Object,
                default() {},
            },
            onlyOne: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                data: {
                    filterModel: null,
                    agentCommissionBrandsTable: [],
                },
                disabledColumnNamesArr: [],
                errors: new Errors(),
            }
        },

        created() {
            this.fetch();
        },

        methods: {
            fetch() {
                axios.get(route('agents.getData'), {
                        params: this.params,
                    })
                    .then(({ data }) => {
                        this.disabledColumnNamesArr = data.disabledColumns;
                        this.disableFieldsRowToAdd();

                        this.data.filterModel = data.fields.filterModel;
                        this.data.agentCommissionBrandsTable = data.fields.agentCommissionBrandsTable;

                        this.blockTableRowToAdd();

                        this.$nextTick(() => this.$refs.agentCommissionBrands.convertMultipleStructure());
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            save() {
                axios.post(route('agents.saveData'), {
                        ...this.params,
                        filterModel: this.data.filterModel,
                        agentCommissionBrandsTable: this.data.agentCommissionBrandsTable,
                    })
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            disableFieldsRowToAdd() {
                this.disabledColumnNamesArr.forEach((field) => {
                    this.$refs.agentCommissionBrands.getRowToAdd(field.name).value = field.id;
                    this.agentCommissionBrandsTemplate.columns[field.name].disabled = true;
                });
            },

            blockTableRowToAdd(dataLength = this.data.agentCommissionBrandsTable.length) {
                if (this.onlyOne) {
                    this.agentCommissionBrandsTemplate.columns.user_id.disabled = dataLength > 0;
                }
            },
        },
    };

</script>
