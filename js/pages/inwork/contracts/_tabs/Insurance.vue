<template>
    <div>
        <wizard :wizard-structure="wizards">

            <template #clients>
                <clients-wizard
                    :options="options.client"/>
            </template>

            <template #insuranceObjects>
                <insurance-objects-wizard
                    :options="options.object"/>
            </template>

            <template #sellerAgent>
                <div class="columns">
                    <div class="column is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            v-if="data.sellerAgent.fields"
                            title="Ahent-prodavets"
                            icon="user-tie">
                            <template #content>
                                <seller-agent :data="data.sellerAgent"/>
                            </template>

                            <template #controls>
                                <div v-if="!data.sellerAgent.warning"
                                    @click="data.sellerAgent.modal = true">
                                    <span class="icon is-warning button is-large is-radiusless">
                                        <fa icon="pen"/>
                                    </span>
                                </div>
                            </template>

                            <template #footer>
                                <div v-if="data.sellerAgent.warning"
                                    class="card-footer-item">
                                    <span class="label">
                                        <span class="icon has-text-warning"><fa icon="exclamation-triangle"/></span>
                                        {{ data.sellerAgent.warning }}</span>
                                </div>
                            </template>
                        </card>
                    </div>
                </div>

                <seller-agent-modal
                    v-if="data.sellerAgent.modal"
                    :state-id="contractId"
                    :data="data.sellerAgent"
                    :show="data.sellerAgent.modal"
                    @close="data.sellerAgent.modal = false"
                    @saved="getSellerAgentCard()"/>
            </template>

            <template #calculations>
                <card v-for="(detailedCalculation, keyDetailedCalculation) in data.detailedCalculation.filter(({ product_subtype_alias }) => ['vehicleKaskoRetail', 'vehicleKaskoBank', 'vehicleOsago', 'vehicleDscv', 'personalIncident'].includes(product_subtype_alias.value))"
                    :key="`detailedCalculation-${keyDetailedCalculation}`"
                    :entity-length="data.detailedCalculation.length"
                    :title="`${detailedCalculation['product_subtype_name'].value} ${detailedCalculation['product_code'].value} ${detailedCalculation['product_name'].value} №${detailedCalculation['contract_code'].value}`"
                    icon="car-crash"
                    :controls="{ status: detailedCalculation.status_name.value }"
                    class="detailed-card">
                    <template #content>
                        <detailed-calculation
                            :data="detailedCalculation"
                            :state-id="contractId"
                            @submit="
                                $store.dispatch('wizard/setSelectedSections', { whiteList: ['calculations'] });
                                getDetailedCalculationCards();
                            "
                            @saved-params="getDetailedCalculationCards()"/>
                    </template>
                </card>
            </template>
        </wizard>
    </div>
</template>

<script>
import Wizard from '@components/Wizard.vue'

import ClientsWizard from '@components/cards/clients/ClientsWizard'
import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

import SellerAgent from '@components/cards/sellerAgent/Card'
import SellerAgentModal from '@components/cards/sellerAgent/Modal'

import Card from '@components/cards/Card'
import DetailedCalculation from '@components/cards/detailedCalculation/Card'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCarCrash } from '@fortawesome/free-solid-svg-icons'
library.add([ faCarCrash ])

export default {
    components: {
        Wizard,

        ClientsWizard,
        InsuranceObjectsWizard,

        SellerAgent,
        SellerAgentModal,

        Card,
        DetailedCalculation,
    },

    inject: ['i18n'],

    props: {
        options: {
            type: Object,
        },
    },

    data() {
        return {
            contractId: Number(this.$route.params.contract),

            data: {
                sellerAgent: {
                    modal: false,
                },
                detailedCalculation: [],
            },
            wizards: {
                clients: {},
                insuranceObjects: {},
                documentsTab: {
                    empty: true,
                },
                sellerAgent: {},
                calculations: {},
            }
        }
    },
    created() {
        this.$store.commit('wizard/setRoute', {
            url: route('wizard.getContractInsurance'),
            params: {
                contract_id: this.contractId,
            },
        });


        this.getDetailedCalculationCards();
        this.getSellerAgentCard();
    },
    methods: {
        getDetailedCalculationCards() {
            axios.get(route('inwork.contracts.getDetailedCalculationCards'), {
                    params: {
                        insurance_contract_id: this.contractId,
                    }
                })
                .then(({ data }) => {
                    this.data.detailedCalculation = data.data;
                });
        },
        getSellerAgentCard() {
            axios.get(`/api/inwork/contracts/questionnaires/sellerAgent/${this.contractId}/edit`, {
                    params: {
                        insurance_contract_id: this.contractId,
                    }
                })
                .then(({ data }) => {
                    this.data.sellerAgent = {
                        ...data.data,
                        modal: false,
                    };
                });
        },
    }
}
</script>

<style lang="sass">
    .detailed-card
        width: 100%
        margin-bottom: 1.2em
</style>
