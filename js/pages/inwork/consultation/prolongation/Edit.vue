<template>
    <div>
        <prolongation
            :consultation-id="consultationId"
            @get-prolongation-origin="prolongationOrigin = $event"/>

        <div class="consultation">
            <clients-wizard
                :options="options.client"
                :old-data="prolongationOrigin && prolongationOrigin.is_old_contract
                    ? prolongationOrigin.insurer
                    : null"
                class="has-margin-bottom-large"/>

            <insurance-objects-wizard
                :options="options.object"
                :old-data="prolongationOrigin && prolongationOrigin.is_old_contract
                    ? prolongationOrigin.insuranceObject
                    : null"
                class="has-margin-bottom-large"/>

            <div class="buttons">
                <button
                    class="button is-link"
                    @click="showRequestQuote = true">
                    {{ i18n('Zapyt na kotuvannya') }}
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
                v-if="prolongationOrigin"
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
                        @header-ready="toogleDisabledEditClassifier()"
                        ref="parameters">
                        <template #use_custom_classifier="{ props }">
                            <form-field
                                v-bind="props"
                                @input="toogleDisabledEditClassifier()"/>
                        </template>
                        <template #historyHeader="{ consultationHistoryData }">
                            <div class="is-divider has-margin-bottom-large"></div>

                            <div class="level is-marginless">
                                <h3 class="level-left title is-6">
                                    {{ i18n('Istoriya konsultatsiy') }}
                                </h3>
                                <div class="level-right buttons">
                                    <button
                                        :disabled="!consultationHistoryData.buttonsStatus.compare"
                                        class="button has-margin-left-medium is-info"
                                        @click="getCompareCalculations(consultationHistoryData)">
                                        {{ i18n('Porivnyaty') }}
                                    </button>

                                    <button
                                        :disabled="!consultationHistoryData.buttonsStatus.create"
                                        class="button has-margin-left-medium is-info"
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
                                        class="button has-margin-left-medium is-info"
                                        @click="$router.replace({
                                            path: consultationHistoryData.checkedRows[0].contract_link,
                                        })">
                                        {{ i18n('Pereyty') }}
                                    </button>
                                </div>
                            </div>
                        </template>
                    </parameters-card>
                </template>
            </card>
        </div>
    </div>
</template>

<script>
import Prolongation from '@pages/inwork/consultation/prolongation/Prolongation';

import ClientsWizard from '@components/cards/clients/ClientsWizard'
import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

import RequestQuote from '@components/cards/parameters/RequestQuote'
import ParametersCard from '@components/cards/parameters/ParametersCard'
import Card from '@components/cards/Card'

import { FormField } from '@enso-ui/forms/bulma'

import { focus, clickOutside } from '@enso-ui/directives'

import errorHandler from '@components/mixins/errorHandler'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog } from '@fortawesome/free-solid-svg-icons'

library.add([faCog]);

export default {
    inject: ['i18n'],

    components: {
        Prolongation,

        ClientsWizard,
        InsuranceObjectsWizard,

        RequestQuote,
        ParametersCard,
        Card,

        FormField,
    },

    data() {
        return {
            consultationId: Number(this.$route.params.consultation),
            prolongationOrigin: null,

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
                            params: {
                                is_prolongation: true,
                            },
                        },
                        suggestProducts: 'inwork.consultations.prolongation.suggestProducts',
                        recalculate: 'inwork.consultations.prolongation.recalculate',
                        saveProductData: 'inwork.consultations.prolongation.saveCalculations',
                        testInsuranceLogic: 'inwork.consultations.prolongation.testInsuranceLogic',

                        getHistory: {
                            url: 'inwork.consultations.getHistoryTableData',
                            params: {
                                insurance_consultation_id: this.$route.params.consultation,
                            },
                        },
                    },
                },
            },
        };
    },

    methods: {
        getAdditionalData() {
            axios.get(route('inwork.consultation.getAdditionalData', this.consultationId))
                .then(({ data }) => {
                    if (this.consultationStatus.alias === data.consultationStatus.alias) return;

                    this.consultationStatus = data.consultationStatus;
                });
        },

        toogleDisabledEditClassifier() {
            this.$refs.parameters.$nextTick(() => {
                const useCustomClassifierValue = this.$refs.parameters.$refs.header.field('use_custom_classifier').value;

                this.$refs.parameters.$refs.header.field('insurance_company_id').meta.disabled = !useCustomClassifierValue;

                this.$set(this.$refs.parameters.$refs.header.field('product_type_id'), 'value', this.prolongationOrigin.product_type_id);
                this.$refs.parameters.$refs.header.field('product_type_id').meta.disabled = !useCustomClassifierValue;

                this.$set(this.$refs.parameters.$refs.header.field('product_subtype_id'), 'value', this.prolongationOrigin.product_subtype_id);
                this.$refs.parameters.$refs.header.field('product_subtype_id').meta.disabled = !useCustomClassifierValue;

                this.$set(this.$refs.parameters.$refs.header.field('insurance_program_id'), 'value', this.prolongationOrigin.insurance_program_id);

                this.$refs.parameters.getDynamicProgramParams(this.prolongationOrigin.product_subtype_id);
            });
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
    },
};

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

