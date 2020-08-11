<template>
    <div>
        <wizard :wizard-structure="wizards">

            <template #clients>
                <clients-wizard
                    :options="options.client"
                    financial-situation
                    :contract-created-at="createdContractAt"
                />
            </template>

            <template #insuranceObjects>
                <insurance-objects-wizard
                    :options="options.object"/>
            </template>

            <template #selectedProducts>
                <card
                    :title="i18n('Zayavky')"
                    icon="user"
                    class="wizard__card"
                    style="width: 100%">
                    <template #content>
                        <selected-products
                            :state-id="Number(contractId)"
                            @get-contract-created-at="createdContractAt = $event"
                        />
                    </template>
                </card>
            </template>

            <template v-if="state.salesContracts.card" #salesContracts>
                <button v-if="data.salesContracts.showButton"
                    class="button is-success has-margin-right-large"
                    @click="state.salesContracts.modal = true">
                    {{ i18n('Stvoryty dogovir kupivli-prodazhu avtomobilya') }}
                </button>

                <div v-else
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            :title="`${i18n('Dogovir kupivli-prodazhu avtomobilya')} №${data.salesContracts.fields.sales_contract_code.value}`"
                            icon="file-contract"
                            :controls="{ edit: true }"
                            @edit="state.salesContracts.modal = true">
                            <template #content>
                                <sales-contract :data="data.salesContracts"/>
                            </template>
                        </card>
                    </div>
                </div>

                <sales-contract-modal
                    :state-id="contractId"
                    :name="data.salesContracts.display_name"
                    :show="state.salesContracts.modal"
                    @close="state.salesContracts.modal = false"
                    @saved="getSalesContracts()"/>
            </template>

            <template v-if="state.carRegistration.card" #carRegistration>
                <button
                    v-if="data.carRegistration.showButton"
                    class="button is-success has-margin-right-large"
                    @click="state.carRegistration.modal = true">
                    {{ i18n('Zareyestruvaty avto') }}
                </button>

                <div v-else
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            title="Reyestratsiya avto"
                            icon="car"
                            :controls="{ edit: true }"
                            @edit="state.carRegistration.modal = true">
                            <template #content>
                                <car-registration :data="data.carRegistration"/>
                            </template>
                        </card>
                    </div>
                </div>

                <car-registration-modal
                    :state-id="contractId"
                    :name="data.carRegistration.display_name"
                    :show="state.carRegistration.modal"
                    @close="state.carRegistration.modal = false"
                    @saved="getCarRegistrationCards()"/>
            </template>

            <template v-if="state.creditRequest.card" #creditRequest>
                <button
                    v-if="data.creditRequest.showButton"
                    class="button is-success has-margin-right-large"
                    @click="state.creditRequest.modal = true">
                    {{ i18n('Stvoryty zapyt na kredytnu uhodu') }}
                </button>

                <div v-else
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            title="Pryznachennya na kred/lizynh uhodu"
                            icon="car"
                            :controls="{ edit: true }"
                            @edit="state.creditRequest.modal = true">
                            <template #content>
                                <credit-request :data="data.creditRequest"/>
                            </template>
                        </card>
                    </div>
                </div>

                <credit-request-modal
                    :state-id="contractId"
                    :api-routes="{
                        fetchForm: 'inwork.contracts.creditSolutions.creditAgreement.fetchForm',
                        saveForm: 'inwork.contracts.creditSolutions.creditAgreement.saveForm',
                    }"
                    :show="state.creditRequest.modal"
                    @close="state.creditRequest.modal = false"
                    @saved="getCreditRequestCards()"/>
            </template>

            <template v-if="state.creditAgreement.card" #creditAgreement>
                <div
                    v-if="!data.creditAgreement.showButton"
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            :title="i18n('Pidtverdzhennya kred/lizynh uhody')"
                            icon="handshake"
                            @edit="state.creditAgreement.modal = true"
                            :controls="{ edit: true }"
                            class="wizard__card">
                            <template #content>
                                <credit-agreement :data="data.creditAgreement"/>
                            </template>
                        </card>
                    </div>
                </div>

                <credit-agreement-modal
                    :state-id="contractId"
                    :name="data.creditAgreement.display_name"
                    :show="state.creditAgreement.modal"
                    @close="state.creditAgreement.modal = false"
                    @saved="getCreditAgreementCards()"
                />
            </template>

            <template v-if="state.carIssuance.card" #carIssuance>
                <button
                    v-if="data.carIssuance.showButton"
                    class="button is-success has-margin-right-large"
                    @click="state.carIssuance.modal = true">
                    {{ i18n('Vydaty avto') }}
                </button>

                <div v-else
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            title="Pidtverdzhennya vydachi avto kliyentu"
                            icon="file-invoice-dollar"
                            :controls="{ edit: true }"
                            @edit="state.carIssuance.modal = true">
                            <template #content>
                                <car-issuance :data="data.carIssuance"/>
                            </template>
                        </card>
                    </div>
                </div>

                <car-issuance-modal
                    :state-id="contractId"
                    :show="state.carIssuance.modal"
                    @close="state.carIssuance.modal = false"
                    @saved="getCarIssuanceCards()"/>
            </template>

        </wizard>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileContract, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
library.add([faFileContract, faFileInvoiceDollar])

import Wizard from '@components/Wizard'

import Card from '@components/cards/Card'

import ClientsWizard from '@components/cards/clients/ClientsWizard'
import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

import SelectedProducts from '@components/cards/parameters/SelectedProducts'

import SalesContract from '@components/cards/salesContracts/Card'
import SalesContractModal from '@components/cards/salesContracts/Modal'

import CarRegistration from '@components/cards/carRegistration/Card'
import CarRegistrationModal from '@components/cards/carRegistration/Modal'

import CreditRequest from '@components/cards/creditRequest/Card'
import CreditRequestModal from '@components/cards/creditRequest/Modal'

import CreditAgreement from '@components/cards/creditAgreement/Card'
import CreditAgreementModal from '@components/cards/creditAgreement/Modal'

import CarIssuance from '@components/cards/carIssuance/Card'
import CarIssuanceModal from '@components/cards/carIssuance/Modal'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        Wizard,

        Card,

        ClientsWizard,
        InsuranceObjectsWizard,

        SalesContract,
        SalesContractModal,

        SelectedProducts,

        CarRegistration,
        CarRegistrationModal,

        CreditRequest,
        CreditRequestModal,

        CreditAgreement,
        CreditAgreementModal,

        CarIssuance,
        CarIssuanceModal,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        options: {
            type: Object,
        },
    },

    data() {
        return {
            contractId: Number(this.$route.params.contract),
            createdContractAt: null,

            state: {
                salesContracts: {
                    card: false,
                    modal: false,
                },
                carRegistration: {
                    card: false,
                    modal: false,
                },
                creditRequest: {
                    card: false,
                    modal: false,
                },
                creditAgreement: {
                    card: false,
                    modal: false,
                },
                carIssuance: {
                    card: false,
                    modal: false,
                },
            },

            data: {
                salesContracts: {},
                carRegistration: {},
                creditRequest: {},
                creditAgreement: {},
                carIssuance: {},
            },
            wizards: {
                clients: [],
                insuranceObjects: [],
                selectedProducts: [],
                salesContracts: [],
                carRegistration: [],
                creditRequest: [],
                creditAgreement: [],
                carIssuance: [],
            },
        }
    },
    created() {
        this.getSalesContracts();
        this.getCarRegistrationCards();
        this.getCreditRequestCards();
        this.getCreditAgreementCards();
        this.getCarIssuanceCards();
    },

    methods: {
        getSalesContracts() {
            axios.get(route('inwork.contracts.creditSolutions.salesContracts.fetchCard'), {
                    params: {
                        insurance_contract_id: this.contractId,
                    }
                })
                .then(({ data }) => {
                    this.data.salesContracts = data.data;

                    this.state.salesContracts.card = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getCarRegistrationCards() {
            axios.get(route('inwork.contracts.creditSolutions.fetchRegistrationCard'), {
                    params: {
                        insurance_contract_id: this.contractId,
                    },
                })
                .then(({ data }) => {
                    this.data.carRegistration = data.data;

                    this.state.carRegistration.card = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getCreditRequestCards() {
            axios.get(route('inwork.contracts.creditSolutions.creditAgreement.fetchCard'), {
                    params: {
                        insurance_contract_id: this.contractId,
                    },
                })
                .then(({ data }) => {
                    this.data.creditRequest = data.data;

                    this.state.creditRequest.card = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getCreditAgreementCards() {
            axios.get(route('inwork.contracts.creditAgreement.confirmation.fetchCard'), {
                params: {
                    insurance_contract_id: this.contractId,
                    },
                })
                .then(({ data }) => {
                    if (data.data.showButton) {
                        // this.$delete(this.wizards, 'creditAgreement');
                        return;
                    }

                    this.data.creditAgreement = data.data;

                    this.state.creditAgreement.card = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getCarIssuanceCards() {
            axios.get(route('inwork.contracts.creditSolutions.carIssuance.fetchCard'), {
                    params: {
                        insurance_contract_id: this.contractId,
                    },
                })
                .then(({ data }) => {
                    this.data.carIssuance = data.data;

                    this.state.carIssuance.card = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
}
</script>

<style lang="sass">
.quoted-calculation-modal,
.add-calculation-modal
    .modal
        &-card
            width: calc(100% - 200px)
            max-width: 1600px
</style>
