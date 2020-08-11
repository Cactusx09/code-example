<template>
    <modal
        show
        class="consultation-request-quote"
        @close="$emit('close')">
        <div class="box">
            <div class="columns">
                <div class="column">
                    <div class="title is-5">
                    {{ i18n('Oberit komisiinu polityku') }}
                </div>
                </div>
            </div>

            <div class="columns">
                <div class="column field is-6-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                    <u-search
                        :api-url="route('administration.calculationCommissions.initSimpleTable')"
                        @accept="
                            productTable = $event;
                            keywords = '';
                        "
                        @cancel="keywords = ''"
                        :table-search.sync="keywords"
                        :min-length="3">
                        <div class="control has-icons-left has-icons-right">
                            <u-input
                                v-model="keywords"
                                :disabled="productTable.length > 0"
                                type="text"
                                placeholder="Poshuk polityky po Kodu abo nazvi"
                            />
                            <span class="icon is-small is-left">
                                <fa icon="search"/>
                            </span>
                        </div>
                    </u-search>
                </div>
            </div>

            <u-table
                v-if="productTable.length"
                :template="policyCalculationCommissionsTemplate"
                :table.sync="productTable"
                :scroll="false"
                class="has-margin-bottom-large">
                <template #actions="{ row }">
                    <button
                        class="button is-small is-table-button has-text-primary"
                        @click="productTable = []">
                        <span class="icon is-small"><fa icon="minus"/></span>
                    </button>
                </template>
            </u-table>

            <div class="buttons level-right">
                <button
                    class="button is-danger"
                    @click="$emit('close')">
                    {{ i18n('Cancel') }}
                </button>

                <button
                    :disabled="!productTable.length"
                    class="button is-success"
                    @click="replaceCalculationCommission()">
                    {{ i18n('Save') }}
                </button>
            </div>
        </div>
    </modal>
</template>

<script>
    import PolicyCalculationCommissions from './PolicyCalculationCommissions'

    import { Modal } from '@enso-ui/modal/bulma'

    import UTable from '@components/UTable.vue'
    import USearch from '@components/USearch.vue'
    import UInput from '@components/UInput.vue'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            Modal,
            UTable,
            USearch,
            UInput,
        },

        inject: ['i18n'],

        mixins: [
            PolicyCalculationCommissions,
            errorHandler,
        ],

        props: {
            calculationId: {
                required: true,
            },
        },

        data() {
            return {
                keywords: '',
                productTable: [],
            };
        },

        created() {
            this.testCalculationCommission();
        },

        methods: {
            replaceCalculationCommission() {
                const data = {
                    calculation_commission_id: this.productTable[0].calculation_commission_id,
                    calculation_id: this.calculationId,
                };

                axios.post(route('inwork.contracts.replaceCalculationCommission'), data)
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));

                        this.$emit('save');
                        this.$emit('close');
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
            testCalculationCommission() {
                axios.get(route('inwork.contracts.testCalculationCommission'), {
                        params: {
                            calculation_id: this.calculationId,
                        }
                    })
                    .then(({ data }) => {
                        console.log(data);
                    });
            },
        },
    };
</script>

<style lang="sass">
.consultation-request-quote
    .modal
        &-content
            display: flex
            justify-content: center
            align-items: center
            height: calc(100vh - 40px)
            width: calc(100vw - 40px)
            .box
                width: 900px
</style>
