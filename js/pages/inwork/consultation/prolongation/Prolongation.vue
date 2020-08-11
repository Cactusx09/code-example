<template>
    <div
        v-if="init"
        class="prolongation">
        <div class="prolongation-notification notification is-danger">
            <div class="has-margin-bottom-medium">
                <p class="title is-6">
                    {{ i18n('UVAHA!!! Rezhym prolonhatsiyi') }}
                </p>
            </div>
            <span>{{ i18n('Prolonhatsiya dostupna dlya dohovoriv, yaki diyut abo zakinchyly svoyu diyu, ne piznishe nizh za 3 misyatsya do daty rozrakhunku prolonhatsiyi.') }}</span>
        </div>

        <div
            v-if="prolongationSelectedTable.length"
            class="prolongation-block">
            <div class="label">{{ i18n('Obranyi dohovir') }}</div>
            <u-table
                :table.sync="prolongationSelectedTable"
                :template="prolongationTemplate"
                :scroll="5">
                <template #insurance_contract_code="{ row }">
                    <div v-if="row.is_old_contract"
                        class="has-margin-bottom-medium">
                        <div class="label has-text-weight-bold has-text-info">{{ i18n('Stara systema') }}</div>
                        <a
                            :href="row.insurance_contract_link"
                            class="tag is-normal is-info"
                            target="_blank">
                            {{ row.insurance_contract_code }}
                        </a>
                    </div>

                    <router-link
                        v-else
                        :to="row.insurance_contract_link"
                        target="_blank">
                        {{ i18n(row.insurance_contract_code) }}
                    </router-link>
                </template>

                <template #actions="{ row }">
                    <button
                        class="button is-small is-table-button has-text-primary"
                        @click="confirmationButtonLogic(row, true)">
                        <span class="icon is-small">
                            <fa icon="minus"/>
                        </span>
                    </button>
                </template>
            </u-table>
        </div>

        <div v-else>
            <div class="label">{{ i18n('Poshuk dohovoru poperednoho periodu') }}</div>

            <div class="prolongation-search columns">
                <div class="column field is-4">
                    <div class="control has-icons-left has-icons-right">
                        <u-input
                            v-model="data.search"
                            :placeholder="i18n('Vvedit dohovor, derzhnomer avto chy vin avto')"
                            type="text"
                            @submit="searchProlongationCalculation()"
                        />
                        <span class="icon is-small is-left">
                            <fa icon="search"/>
                        </span>
                    </div>
                </div>

                <div class="column field is-narrow">
                    <button
                        class="button is-success"
                        @click="searchProlongationCalculation()">
                        {{ i18n('Znayty') }}
                    </button>
                </div>

                <div class="column field is-narrow">
                    <vue-switch
                        v-model="data.ignoreDates"
                        size="is-large"
                        type="is-success"
                        class="has-margin-right-large">
                        <label class="title is-6 is-marginless">
                            {{ i18n('Shukaty dohovory za ves period') }}
                        </label>
                    </vue-switch>
                </div>
            </div>

            <div v-if="prolongationCalculationTable.length"
                class="prolongation-block">
                <div class="label">{{ i18n('Perelik dohovoriv') }}</div>
                <u-table
                    :table.sync="prolongationCalculationTable"
                    :template="prolongationTemplate"
                    :scroll="5">
                    <template #insurance_contract_code="{ row }">
                        <div v-if="row.is_old_contract"
                            class="has-margin-bottom-medium">
                            <div class="label has-text-weight-bold has-text-info">{{ i18n('Stara systema') }}</div>
                            <a
                                :href="row.insurance_contract_link"
                                class="tag is-normal is-info"
                                target="_blank">
                                {{ row.insurance_contract_code }}
                            </a>
                        </div>

                        <router-link
                            v-else
                            :to="row.insurance_contract_link"
                            target="_blank">
                            {{ i18n(row.insurance_contract_code) }}
                        </router-link>
                    </template>

                    <template #actions="{ row }">
                        <button
                            class="button is-small is-table-button has-text-primary"
                            @click="confirmationButtonLogic(row)">
                            <span class="icon is-small">
                                <fa v-show="isCurrentRow(row)" icon="check"/>
                            </span>
                        </button>
                    </template>
                </u-table>

                <div class="columns">
                    <div class="column field is-narrow">
                        <button
                            :disabled="!calculation_id && !old_contract_id"
                            class="button is-success has-margin-top-large"
                            @click="create()">
                            {{ i18n('Obraty') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <confirm-modal :visible.sync="confirmation"
            @submit="removeProlongation()"
            title="Vydalyty zapys?">
        </confirm-modal>
    </div>
</template>

<script>
import UInput from '@components/UInput.vue';
import UTable from '@components/UTable.vue';
import VueSwitch from '@enso-ui/switch/bulma';

import ConfirmModal from '@components/ConfirmModal'

import Prolongation from './ProlongationTemplate.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
library.add([faCheck, faMinus]);

import errorHandler from '@components/mixins/errorHandler';

export default {
    components: {
        UInput,
        UTable,
        VueSwitch,

        ConfirmModal,
    },

    inject: ['i18n'],

    mixins: [Prolongation, errorHandler],

    props: {
        consultationId: {
            type: Number,
            default: null,
        },
    },

    data() {
        return {
            init: false,
            data: {
                search: null,
                ignoreDates: false,
            },
            calculation_id: null,
            old_contract_id: null,
            is_old_contract: false,
            confirmation: false,
            prolongationCalculationTable: [],
            prolongationSelectedTable: [],
        };
    },

    created() {
        if (this.consultationId) {
            this.getProlongationOrigin();
        } else {
            this.init = true;
        }
    },

    methods: {
        clearSelectedRow() {
            this.calculation_id = null;
            this.old_contract_id = null;
            this.is_old_contract = false;
        },
        isCurrentRow(row) {
            let calculationId = 'calculation_id' in row ? row.calculation_id : null,
                oldContractId = 'old_contract_id' in row ? row.old_contract_id : null,
                result = false;

            if (calculationId > 0) {
                result = calculationId === this.calculation_id;
            } else if (oldContractId > 0) {
                result = oldContractId === this.old_contract_id;
            }

            return result;
        },
        confirmationButtonLogic(row, setConfirmation = false) {
            this.calculation_id = 'calculation_id' in row ? row.calculation_id : null;
            this.old_contract_id = 'old_contract_id' in row ? row.old_contract_id : null;
            this.is_old_contract = 'is_old_contract' in row ? row.is_old_contract : false;

            if (setConfirmation) {
                this.confirmation = true;
            }
        },
        getProlongationOrigin() {
            this.clearSelectedRow();

            axios.get(
                    route('inwork.consultations.prolongation.getProlongationOrigin'),
                    {
                        params: {
                            consultation_id: this.consultationId,
                        },
                    },
                )
                .then(({ data }) => {
                    this.prolongationSelectedTable.push(data);
                    this.init = true;

                    this.$emit('get-prolongation-origin', data);
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        searchProlongationCalculation() {
            this.clearSelectedRow();

            axios.get(route('inwork.consultations.prolongation.searchProlongationCalculation'), {
                    params: {
                        search: this.data.search,
                        ignoreDates: this.data.ignoreDates ? 1 : 0,
                    },
                })
                .then(({ data }) => {
                    if (data.length === 0) {
                        this.$toastr.error('Dohovir ne znaideno');
                    }

                    this.prolongationCalculationTable = data;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        create() {
            let params = {is_old_contract: this.is_old_contract};

            if (this.is_old_contract) {
                params.old_contract_id = this.old_contract_id;
            } else {
                params.calculation_id = this.calculation_id;
            }

            axios.post(
                    route('inwork.consultations.prolongation.create'),
                    params
                )
                .then(({ data }) => {
                    this.$toastr.success('Dohovir obranyy');

                    this.$router.push({
                        name: 'inwork.consultations.prolongation.edit',
                        params: { consultation: data.consultation_id },
                    });
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        removeProlongation() {
            axios.get(
                    route('inwork.consultations.prolongation.removeProlongation'),
                    {
                        params: {
                            consultation_id: this.consultationId,
                        },
                    },
                )
                .then(({ data }) => {
                    this.$toastr.success('Dohovir uspishno vydalenyi');

                    if (data.consultation_id) {
                        this.$router.push({
                            name: 'inwork.consultations.prolongation.edit',
                            params: { consultation: data.consultation_id },
                        });
                    } else {
                        this.$router.push({ name: 'inwork.consultations.prolongation.create' });
                    }
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>

<style lang="sass">
.prolongation
    &-block
        margin: 1em 0
</style>
