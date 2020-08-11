<template>
    <div>
        <div v-if="Object.keys(data.searchConditions).length > 0">
            <div class="title is-6 is-center">{{ i18n('Parametry produktu') }}</div>
            <div class="notification">
                <div class="wizard__columns columns">
                    <card-list v-for="(item, key) in data.searchConditions"
                        :key="`searchConditions:${key}`"
                        :class="`column is-${getSearchConditionsColumnSize}`"
                        :label="item.label"
                        :content="[
                            item.value,
                        ]"
                        vertical/>
                </div>
            </div>
        </div>

        <div class="title is-6 is-center">{{ i18n('Rezultat rozrakhunkiv') }}</div>
        <div class="notification">
            <div class="wizard__columns columns">
                <card-list v-for="(item, key) in data.insuranceLogicVariables"
                    :key="`insuranceLogicVariables:${key}`"
                    class="column is-2"
                    :label="item.label"
                    :content="[
                        item.value,
                    ]"
                    vertical/>
            </div>
        </div>

        <u-table
            v-if="data.detailedFormTable && data.detailedFormTable.length > 0"
            :template="detailedCalculationTemplate[currentTable]"
            :table.sync="data.detailedFormTable"
            :scroll="5"
            class="has-margin-bottom-large"/>

        <div class="buttons is-marginless">
            <div v-for="key in currentButtons"
                :key="key"
                :class="['button', buttons[key].class]"
                :disabled="buttons[key].disabled && !data[buttons[key].disabled]"
                @click="modalKey = key">
                {{ i18n(buttons[key].label) }}
            </div>
        </div>

        <extended-calculation
            v-if="data.is_extendable"
            :detailed-calculation="data"
            ref="extendedCalculation"
        />

        <confirm-modal v-if="modalKey === 'formContractCalculationConfirmation'"
            :visible.sync="modalKey"
            title='Perevesty dohovir v status "Sformovano"?'
            @submit="getFormContractCalculationProduct()">
        </confirm-modal>

        <confirm-modal v-else-if="modalKey === 'quoteCalculation'"
            :visible.sync="modalKey"
            title="Kotyruvaty produkt?"
            @submit="quoteCalculation()">
        </confirm-modal>

        <confirm-modal v-else-if="modalKey === 'detailedCalculationProlongation'"
            :visible.sync="modalKey"
            @created="!data.prolongation.isProlongationPeriodExpired ? createProlongation() : null"
            @submit="createProlongation()">
            <template #header>
                <div class="notification is-danger">
                    <div class="has-margin-bottom-medium">
                        <p class="title is-6">
                            {{ i18n('UVAHA!!') }}
                        </p>
                    </div>
                    <span>{{ i18n('Strok dlya prolonhatsiyi obranoho dohovoru vycherpano!!! Stvoryty prolonhatsiyu vse odno?') }}</span>
                </div>
            </template>
        </confirm-modal>

        <component
            v-else-if="modalKey"
            :is="`${modalKey}Modal`"
            :calculation-product-id="data.insurance_consultation_product_calculation_id.value"
            @close="modalKey = false"
            @save="submit()"/>
    </div>
</template>

<script>
import DetailedCalculation from '@templates/detailedCalculationCard/DetailedCalculation.js'
import Buttons from '@components/cards/detailedCalculation/Buttons'

import EditCalculationModal from '@components/cards/detailedCalculation/modals/EditCalculation'
import QuoteCalculationRequestModal from '@components/cards/detailedCalculation/modals/QuoteCalculationRequest'
import DetailedCalculationModal from '@components/cards/detailedCalculation/modals/DetailedCalculation'
import DetailedCalculationInterruptedModal from '@components/cards/detailedCalculation/modals/Interrupted'
import DetailedCalculationSpoilModal from '@components/cards/detailedCalculation/modals/Spoil'
import DetailedCalculationDuplicateModal from '@components/cards/detailedCalculation/modals/Duplicate'
import DetailedCalculationRearrangedModal from '@components/cards/detailedCalculation/modals/Rearranged'

import CardList from '@components/cards/CardList'
import UTable from '@components/UTable'

import { Modal } from '@enso-ui/bulma'
import ConfirmModal from '@components/ConfirmModal'

import ExtendedCalculation from '@components/cards/detailedCalculation/ExtendedCalculation'

import errorHandler from '@components/mixins/errorHandler'

export default {
    inject: ['i18n'],

    mixins: [errorHandler],

    components: {
        EditCalculationModal,
        QuoteCalculationRequestModal,
        DetailedCalculationModal,
        DetailedCalculationInterruptedModal,
        DetailedCalculationSpoilModal,
        DetailedCalculationDuplicateModal,
        DetailedCalculationRearrangedModal,

        CardList,
        UTable,
        ExtendedCalculation,

        Modal,
        ConfirmModal,
    },

    mixins: [
        DetailedCalculation,
        Buttons,
    ],

    props: {
        data: {
            type: Object,
        },
        stateId: [String, Number],
    },

    data() {
        return {
            currentButtons: [],
            currentTable: null,
            modalKey: false,
        }
    },

    created() {
        this.changeProductTypeTemplate();
    },

    computed: {
        getSearchConditionsColumnSize() {
            const length = Object.keys(this.data.searchConditions).length;

            return length < 7 ? Math.round(12 / length) : 2;
        },
    },

    methods: {
        submit() {
            this.$emit('submit');

            if (!!this.$refs.extendedCalculation)
                this.$refs.extendedCalculation.show = false;
        },

        changeProductTypeTemplate() {
            switch (this.data.product_subtype_alias.value) {
                case 'vehicleKaskoRetail':
                case 'vehicleKaskoBank': {
                    this.currentButtons = [
                        'editCalculation',
                        'quoteCalculationRequest',
                        'quoteCalculation',
                        'detailedCalculationInterrupted',
                        'detailedCalculation',
                        'formContractCalculationConfirmation',
                        'detailedCalculationProlongation',
                        'detailedCalculationDU',
                    ];
                    this.currentTable = 1;
                    break;
                }
                case 'vehicleOsago': {
                    this.currentButtons = [
                        'editCalculation',
                        'quoteCalculationRequest',
                        'quoteCalculation',
                        'detailedCalculationInterrupted',
                        'detailedCalculationSpoil',
                        'detailedCalculationDuplicate',
                        'detailedCalculationRearranged',
                        'detailedCalculation',
                        'formContractCalculationConfirmation',
                        'detailedCalculationProlongation',
                    ];
                    this.currentTable = 2;
                    break;
                }
                case 'vehicleDscv': {
                    if (this.data.product_program_alias.value === 'vehicleDscv::blank') {
                        this.currentButtons = [
                            'editCalculation',
                            'quoteCalculationRequest',
                            'quoteCalculation',
                            'detailedCalculationInterrupted',
                            'detailedCalculationSpoil',
                            'detailedCalculationDuplicate',
                            'detailedCalculationRearranged',
                            'detailedCalculation',
                            'formContractCalculationConfirmation',
                        ];
                    }

                    if (this.data.product_program_alias.value === 'vehicleDscv::contract') {
                        this.currentButtons = [
                            'editCalculation',
                            'detailedCalculationInterrupted',
                            'detailedCalculation',
                            'formContractCalculationConfirmation',
                        ];
                    }

                    if (this.currentButtons.length === 0) {
                        this.currentButtons = [
                            'detailedCalculationInterrupted',
                            'detailedCalculation',
                            'formContractCalculationConfirmation',
                        ];
                    }

                    this.currentTable = 2;
                    break;
                }
                case 'personalIncident': {
                    this.currentButtons = [
                        'editCalculation',
                        'quoteCalculationRequest',
                        'detailedCalculation',
                        'formContractCalculationConfirmation',
                    ];
                    this.currentTable = 3;
                    break;
                }
            }
        },
        getFormContractCalculationProduct() {
            axios.get(route('inwork.contracts.formContractCalculationProduct'), {
                    params: {
                        calculation_product_id: this.data.insurance_consultation_product_calculation_id.value,
                    }
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.submit();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        quoteCalculation() {
            const routeData = this.$router.resolve({
                name: 'administration.insuranceProducts.create',
                query: {
                    calculationId: this.data.insurance_consultation_product_calculation_id.value,
                },
            });

            window.open(routeData.href, '_blank');
        },

        createProlongation() {
            axios.post(route('inwork.consultations.prolongation.create'), {
                    calculation_id: this.data.insurance_consultation_product_calculation_id.value,
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$router.push({
                        name: 'inwork.consultations.prolongation.edit',
                        params: {
                            consultation: data.consultation_id,
                        },
                    });

                    // this.prolongation.isProlongation = data.is_prolongation;
                    // this.prolongation.isExtensionPeriodExpired = data.is_extension_period_expired || false;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
}
</script>

<style lang="sass">
.wizard
    &__columns
        display: flex
        flex-wrap: wrap
.mr-lf_auto
    margin-left: auto
</style>
