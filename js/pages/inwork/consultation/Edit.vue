<template>
    <div class="consultation">
        <wizard
            :wizard-structure="wizards"
            :route="{
                url: route('wizard.getConsultation'),
                params: {
                    consultation_id: consultationId,
                },
            }"
            ref="wizard">

            <template #clients>
                <clients-wizard
                    :options="options.client"
                    @saved="redirectAfterSave({ consultationId: $event.consultation_id })"
                    />
                    <!-- @loaded="
                        $refs.wizard.highlightErrors('clients');
                    "/> -->
                        <!-- $refs.wizard.getWizard({ whitelist: ['clients'] }); -->
            </template>

            <template #insuranceObjects>
                <insurance-objects-wizard
                    :options="options.object"
                    @saved="getWrongAgencyWarning($event)"
                    @loaded="
                        pendingCostEstimateRequest = $event.data.some((row) => row.pending_cost_estimate_request_id != null);
                        disabledSuggestProduct();
                    "
                    />
                    <!-- @loaded="
                        $refs.wizard.highlightErrors('insuranceObjects');
                    "/> -->
                        <!-- $refs.wizard.getWizard({ whitelist: ['insuranceObjects'] }); -->
            </template>

            <template #searchConditions>
                <div class="buttons">
                    <button
                        class="button is-link"
                        @click="showRequestQuote = true">
                        {{ i18n('Zapyt na strakhuvannya') }}
                    </button>

                    <request-quote
                        v-if="showRequestQuote"
                        :state-id="{
                            id: consultationId,
                            name: 'consultation_id',
                        }"
                        @close="showRequestQuote = false"
                        @saved="getAdditionalData()"
                    />
                </div>

                <card
                    title="Parametry"
                    :controls="{
                        status: consultationStatus.name,
                    }"
                    icon="cog"
                    :class="['wizard__card', `parameters_${consultationStatus.alias}`]"
                    style="width: 100%">
                    <template #content>
                        <parameters-card
                            :state-id="{
                                id: consultationId,
                                name: 'consultation_id',
                            }"
                            :parameters-options="options.parameters"
                            ref="parametersCard"
                            @header-ready="disabledSuggestProduct()"
                            @saved-params="redirectAfterSave({ consultationId: $event.consultation_id })">
                            <template #historyHeader="{ consultationHistoryData }">
                                <div class="is-divider has-margin-bottom-large"></div>

                                <div class="level is-marginless">
                                    <h3 class="level-left title is-6">
                                        {{ i18n('Istoriya konsultatsiy') }}
                                    </h3>
                                    <div class="level-right buttons">
                                        <button
                                            :disabled="!consultationHistoryData.buttonsStatus.compare"
                                            class="button has-margin-left-medium is-info is-size-7-mobile"
                                            @click="getCompareCalculations(consultationHistoryData)">
                                            {{ i18n('Porivnyaty') }}
                                        </button>

                                        <button
                                            :disabled="!consultationHistoryData.buttonsStatus.create"
                                            class="button has-margin-left-medium is-info is-size-7-mobile"
                                            @click="$router.replace({
                                                name: 'inwork.contracts.create',
                                                params: {
                                                    calculation_ids: consultationHistoryData.checkedRows.map((row) => row['insurance_consultation_product_id']),
                                                    consultationId: consultationId,
                                                },
                                            })">
                                            {{ i18n('Stvoryty dohovir') }}
                                        </button>

                                        <button
                                            :disabled="!consultationHistoryData.buttonsStatus.goto"
                                            class="button has-margin-left-medium is-info is-size-7-mobile"
                                            @click="$router.replace({
                                                path: consultationHistoryData.checkedRows[0].contract_link,
                                            })">
                                            {{ i18n('Pereyty') }}
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </parameters-card>
                            <!-- @get-params="wizards.searchConditions = $event.wizard"
                            @get-dynamic-params="wizards.searchConditions = $event.wizard"
                            @get-history="wizards.consultationHistory = $event.wizard" -->
                    </template>
                </card>
            </template>

        </wizard>

        <confirm-modal :visible.sync="modal.notification"
            :title="modal.notification"
            @close="getWrongAgencyWarning()"
            @submit="getWrongAgencyWarning()">
        </confirm-modal>
    </div>
</template>

<script>

import Wizard from '@components/Wizard'

import ClientsWizard from '@components/cards/clients/ClientsWizard'
import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

import RequestQuote from '@components/cards/parameters/RequestQuote'
import ParametersCard from '@components/cards/parameters/ParametersCard'
import Card from '@components/cards/Card'

import ConfirmModal from '@components/ConfirmModal'

import errorHandler from '@components/mixins/errorHandler'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog } from '@fortawesome/free-solid-svg-icons'

library.add([faCog]);

export default {
    components: {
        Wizard,

        ClientsWizard,
        InsuranceObjectsWizard,

        RequestQuote,
        ParametersCard,
        Card,

        ConfirmModal,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    data() {
        return {
            consultationId: Number(this.$route.params.consultation),

            showRequestQuote: false,
            consultationStatus: {
                name: null,
                alias: 'undefined',
            },

            options: {
                client: {
                    params: {
                        consultation_id: this.$route.params.consultation,
                        stateAlias: 'consultation',
                    },
                    limit: 1,
                    apiRoutes: {
                        getAll: 'inwork.consultations.getClientsByConsultation',
                        getById: 'inwork.consultations.getClientById',
                        getBySnapshotId: 'inwork.consultations.getClientBySnapshotId',
                        getStructure: 'inwork.consultations.getClientStructure',
                        save: 'inwork.consultations.saveClientData',
                        detach: 'inwork.consultations.detachClient',
                    },
                },
                object: {
                    limit: 1,
                    params: {
                        consultation_id: this.$route.params.consultation,
                        stateAlias: 'consultation',
                    },
                    apiRoutes: {
                        getAll: 'inwork.consultations.getInsuranceObjectsByConsultation',
                        getBySnapshotId: 'inwork.consultations.getInsuranceObjectBySnapshotId',
                        getById: 'inwork.consultations.getInsuranceObjectById',
                        searchById: 'inwork.consultations.searchInsuranceObjectById',
                        getStructure: 'inwork.consultations.getInsuranceObjectStructure',
                        save: 'inwork.consultations.saveInsuranceObjectData',
                        detach: 'inwork.consultations.detachIObject',
                    },
                },

                parameters: {
                    stateAlias: 'consultation',
                    apiRoutes: {
                        getForm: {
                            url: 'insuranceprogramparams.getData',
                        },

                        suggestProducts: 'inwork.consultations.suggestProducts',
                        recalculate: 'inwork.consultations.recalculate',
                        saveProductData: 'inwork.consultations.saveProductData',
                        testInsuranceLogic: 'inwork.consultations.testInsuranceLogic',

                        getHistory: {
                            url: 'inwork.consultations.getHistoryTableData',
                            params: {
                                insurance_consultation_id: this.$route.params.consultation,
                            },
                        },
                    },
                },
            },

            wizards: {
                clients: {},
                insuranceObjects: {},
                searchConditions: {
                    position: true,
                },
            },

            modal: {
                consultationId: null,
                notification: null,
            },
            pendingCostEstimateRequest: false,
        }
    },

    created() {
        this.getAdditionalData();
    },

    methods: {
        getAdditionalData() {
            axios.get(route('inwork.consultation.getAdditionalData', this.consultationId))
                .then(({ data }) => {
                    if (this.consultationStatus.alias === data.consultationStatus.alias) return;

                    this.consultationStatus = data.consultationStatus;
                });
        },

        redirectAfterSave({ consultationId }) {
            if (consultationId !== this.consultationId) {
                this.$router.push({
                    name: 'inwork.consultation.edit',
                    params: {
                        consultation: consultationId,
                    },
                })
            }
        },

        getWrongAgencyWarning(event = {}) {
            if (event.wrongAgencyWarning) {
                this.modal = {
                    notification: event.wrongAgencyWarning,
                    consultationId: event.consultation_id,
                };
                return;
            }

            this.modal.notification = null;
            this.$nextTick(() => this.redirectAfterSave({ consultationId: event.consultation_id || this.modal.consultationId }));
        },

        getCompareCalculations(consultationHistoryData) {
            const routeData = this.$router.resolve({
                name: 'inwork.consultation.compareCalculations',
                query: {
                    insurance_consultation_id: consultationHistoryData.checkedRows[0].insurance_consultation_id,
                    calculation_ids: consultationHistoryData.checkedRows.map((row) => row.insurance_consultation_product_id),
                },
                params: {
                    contract: 1,
                },
            });

            window.open(routeData.href, '_blank');
        },

        disabledSuggestProduct() {
            this.$nextTick(() => {
                const headerParameters = this.$refs.parametersCard.$refs.header;

                if (headerParameters) {
                    const disabledProductType = this.pendingCostEstimateRequest;

                    headerParameters.field('product_type_id').meta.disabled = disabledProductType;
                    if (disabledProductType) headerParameters.field('product_type_id').value = null;
                }
            });
        },
    },
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"
.parameters
    &_requestQuote
        .card-header-status
            background: $yellow
            color: $grey-darker !important
            height: 100%
    &_requestQuoteRejected
        .card-header-status
            background: $red
            color: $white !important
            height: 100%
    &_requestQuoteAccepted
        .card-header-status
            background: $green
            color: $white !important
            height: 100%
</style>
