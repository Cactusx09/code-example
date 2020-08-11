<template>
    <div>
        <wizard :wizard-structure="wizards">

            <template v-if="state.creditRequest.card" #creditRequest>
                <button
                    v-if="data.creditRequest.showButton"
                    class="button is-success has-margin-top-large"
                    @click="state.creditRequest.modal = true">
                    {{ i18n('Pryznachyty chas ta mistse uhody') }}
                </button>

                <div
                    v-else
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            :title="i18n('Pryznachennya na kred/lizynh uhodu')"
                            icon="file-invoice-dollar"
                            :controls="{ edit: true }"
                            @edit="state.creditRequest.modal = true"
                            class="wizard__card"
                            style="width: 75%">
                            <template #content>
                                <credit-request :data="data.creditRequest"/>
                            </template>
                        </card>
                    </div>
                </div>

                <credit-request-modal :state-id="contractId"
                    :api-routes="{
                        fetchForm: 'inwork.contracts.creditAgreement.request.fetchForm',
                        saveForm: 'inwork.contracts.creditAgreement.request.saveForm',
                    }"
                    :show="state.creditRequest.modal"
                    @close="state.creditRequest.modal = false"
                    @saved="getCreditRequestCards()"/>
            </template>

            <template v-if="state.creditAgreement.card" #creditAgreement>
                <button v-if="data.creditAgreement.showButton"
                    class="button is-success has-margin-right-large"
                    @click="state.creditAgreement.modal = true">
                    {{ i18n('Pidtverdyty uhodu') }}
                </button>

                <div
                    v-else
                    class="columns">
                    <div class="column is-6-fullhd is-9-widescreen is-6-desktop is-6-tablet is-6-mobile">
                        <card
                            :title="i18n('Pidtverdzhennya kred/lizynh uhody')"
                            icon="handshake"
                            :controls="{ edit: true }"
                            @edit="state.creditAgreement.modal = true"
                            class="wizard__card"
                            style="width: 75%">
                            <template #content>
                                <credit-agreement :data="data.creditAgreement"/>
                            </template>
                        </card>
                    </div>
                </div>

                <credit-agreement-modal :state-id="contractId"
                    :name="data.creditAgreement.display_name"
                    :show="state.creditAgreement.modal"
                    @close="state.creditAgreement.modal = false"
                    @saved="getCreditAgreementCards()"/>
            </template>

        </wizard>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileInvoiceDollar, faHandshake } from '@fortawesome/free-solid-svg-icons'
library.add([faFileInvoiceDollar, faHandshake])

import Wizard from '@components/Wizard.vue'

import Card from '@components/cards/Card'

import CreditRequest from '@components/cards/creditRequest/Card'
import CreditRequestModal from '@components/cards/creditRequest/Modal'

import CreditAgreement from '@components/cards/creditAgreement/Card'
import CreditAgreementModal from '@components/cards/creditAgreement/Modal'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        Wizard,

        Card,

        CreditRequest,
        CreditRequestModal,

        CreditAgreement,
        CreditAgreementModal,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    data() {
        return {
            contractId: Number(this.$route.params.contract),

            state: {
                creditRequest: {
                    card: false,
                    modal: false,
                },
                creditAgreement: {
                    card: false,
                    modal: false,
                },
            },

            data: {
                creditRequest: {},
                creditAgreement: {},
            },
            wizards: {
                creditRequest: [],
                creditAgreement: [],
            },
        }
    },
    created() {
        this.getCreditRequestCards();
        this.getCreditAgreementCards();
    },

    methods: {
        getCreditRequestCards() {
            axios.get(route('inwork.contracts.creditAgreement.request.fetchCard'), {
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
                    this.data.creditAgreement = data.data;

                    this.state.creditAgreement.card = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        }
    }
}
</script>
