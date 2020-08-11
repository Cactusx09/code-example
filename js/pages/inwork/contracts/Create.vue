<template>
    <div>
        <div
            v-if="prolongation.isProlongation"
            class="notification is-danger">
            <div class="has-margin-bottom-medium">
                <p class="title is-6">
                    {{ i18n('UVAHA!!! Rezhym prolonhatsiyi') }}
                </p>
            </div>
            <span>{{ i18n('Prolonhatsiya dostupna dlya dohovoriv, yaki diyut abo zakinchyly svoyu diyu, ne piznishe nizh za 3 misyatsya do daty rozrakhunku prolonhatsiyi.') }}</span>
        </div>

        <wizard :wizard-structure="wizards">
            <template #clients>
                <clients-wizard
                    :options="options.client"/>
            </template>

            <template #insuranceObjects>
                <insurance-objects-wizard
                    :options="options.object"/>
            </template>

            <template #contractData>
                <div class="columns">
                    <div class="column is-4-fullhd is-4-widescreen is-5-desktop is-8-tablet is-12-mobile">
                        <div class="field">
                            <div class="label">{{ i18n('Manager') }}</div>
                            <vue-select
                                v-model="managerId"
                                :i18n="i18n"
                                @selection="$store.commit('wizard/updateGroupStyle', { group: 'manager', style: $event ? 'done' : 'inProcess' })"
                                :source="route('agents.agencyFilterOptions')"/>
                        </div>
                    </div>
                </div>
            </template>

            <template #parametersCard>
                <card
                    title="Parametry"
                    icon="cog"
                    class="wizard__card"
                    style="width: 100%">
                    <template #content>
                        <consultation-history
                            v-if="consultationHistoryData.inited"
                            :consultation-history-data="consultationHistoryData">
                            <template #footer>
                                <div class="level-right has-margin-top-large">
                                    <button
                                        @click="$router.push({
                                            name: 'inwork.consultation.edit',
                                            params: {
                                                consultation: consultationId,
                                            }
                                        })"
                                        class="button is-info has-margin-right-large">
                                        {{ i18n('Zminyty produkt') }}
                                    </button>

                                    <block-message
                                        :blocking-msg="consultationHistoryData.productsTable.map(row => row.calculations[0].data.blocking_msg)"
                                        :warning-msg="consultationHistoryData.productsTable.map(row => row.calculations[0].data.warning_msg)">
                                        <template v-slot="{ runTest }">
                                            <button
                                                @click="runTest().then(() => {
                                                    prolongation.isExtensionPeriodExpired
                                                        ? prolongation.confirmation = true
                                                        : createContract()
                                                })"
                                                class="button is-medium is-success">
                                                {{ i18n('Stvoryty dohovir') }}
                                            </button>
                                        </template>

                                        <template #buttons="{ setShow }">
                                            <div class="level-item">
                                                <button
                                                    @click="
                                                        setShow(false);
                                                        $nextTick(() => {
                                                            $router.push({
                                                                name: 'inwork.consultation.edit',
                                                                params: {
                                                                    consultation: consultationId,
                                                                }
                                                            })
                                                        })
                                                    "
                                                    class="button is-info">
                                                    {{ i18n('Zminyty produkt') }}
                                                </button>
                                            </div>
                                        </template>
                                    </block-message>
                                </div>
                            </template>
                        </consultation-history>
                    </template>
                </card>
            </template>
        </wizard>

        <confirm-modal :visible.sync="prolongation.confirmation"
            @submit="createContract()">
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

        <confirm-modal :visible.sync="notification"
            :title="notification"
            @submit="$nextTick(() => {
                $router.push({
                    name: 'inwork.consultation.edit',
                    params: {
                        consultation: consultationId,
                    }
                })
            })">
        </confirm-modal>
    </div>
</template>

<script>
    import ConfirmModal from '@components/ConfirmModal'
    import { VueSelect } from '@enso-ui/select/bulma'

    import Wizard from '@components/Wizard'

    import Card from '@components/cards/Card'

    import ClientsWizard from '@components/cards/clients/ClientsWizard'
    import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

    import ConsultationHistory from '@components/cards/parameters/ConsultationHistory'

    import errorHandler from '@components/mixins/errorHandler'

    import BlockMessage from '@components/validations/BlockMessage'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faCog } from '@fortawesome/free-solid-svg-icons'

    library.add([faCog]);

    export default {
        components: {
            ConfirmModal,
            VueSelect,

            Wizard,
            Card,

            ClientsWizard,
            InsuranceObjectsWizard,

            ConsultationHistory,
            BlockMessage,
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        props: {
            calculation_ids: {
                type: Array,
            },
            consultationId: {
                type: [Number, String],
            },
        },

        data() {
            return {
                prolongation: {
                    isProlongation: false,
                    isExtensionPeriodExpired: false,
                    confirmation: false,
                },
                notification: null,
                managerId: null,
                wizards: {
                    clients: {},
                    insuranceObjects: {},
                    contractData: {},
                    parametersCard: {},
                    consultationHistory: {},
                },
                options: {
                    client: {
                        params: {
                            calculation_ids: this.calculation_ids,
                            stateAlias: 'actualization',
                        },
                        apiRoutes: {
                            getAll: 'inwork.contracts.questionnaires.getClientsByCalculations',
                            getById: 'inwork.contracts.questionnaires.getClientById',
                            getBySnapshotId: 'inwork.contracts.questionnaires.getClientBySnapshotId',
                            getStructure: 'inwork.contracts.questionnaires.getClientStructure',
                            save: 'inwork.contracts.questionnaires.saveClientData',
                        },
                    },

                    object: {
                        params: {
                            calculation_ids: this.calculation_ids,
                            stateAlias: 'actualization',
                        },
                        apiRoutes: {
                            getAll: 'inwork.contracts.questionnaires.getInsuranceObjectsByCalculations',
                            getBySnapshotId: 'inwork.contracts.questionnaires.getInsuranceObjectBySnapshotId',
                            getById: 'inwork.contracts.questionnaires.getInsuranceObjectById',
                            searchById: 'inwork.contracts.questionnaires.searchInsuranceObjectById',
                            getStructure: 'inwork.contracts.questionnaires.getInsuranceObjectStructure',
                            save: 'inwork.contracts.questionnaires.saveInsuranceObjectData',
                        },
                    },
                },

                consultationHistoryData: {
                    stateAlias: 'actualization',
                    inited: true,
                    productsTable: [],
                    isInfoActive: false,
                    route: {
                        url: 'inwork.contracts.questionnaires.getHistoryTableData',
                        params: {
                            calculation_ids: this.calculation_ids,
                        },
                    },
                    status: {
                        alias: null,
                    },
                    search: false,
                    extraParams: {
                        rows: [],
                        disabled: true,
                    },
                    buttonsStatus: {
                        create: false,
                        goto: false,
                        compare: false,
                    },
                    checkedRows: [],
                },
            };
        },


        created() {
            this.$store.commit('wizard/setRoute', {
                url: route('wizard.getActualization'),
                params: {
                    calculation_ids: this.calculation_ids,
                },
            });

            this.getProlongationData();
        },

        methods: {
            createContract() {
                axios.post(route('inwork.contracts.questionnaires.createContract'), {
                        calculation_ids: this.calculation_ids,
                        manager_id: this.managerId,
                    })
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                        this.$router.push({
                            path: data.redirect_url,
                            params: {
                                contract: data.insurance_contract_id,
                                insuranceConsultationProductIds: this.calculation_ids,
                                manager_id: this.managerId,
                            },
                        });
                    })
                    .catch((error) => {
                        const wrongAgencyError = error.response.data.errors.wrongAgencyError;

                        wrongAgencyError
                            ? this.notification = wrongAgencyError[0]
                            : this.errorHandler(error);
                    });
            },
            getProlongationData() {
                axios.get(route('inwork.contracts.questionnaires.getProlongationData'), {
                        params: {
                            calculation_ids: this.calculation_ids,
                        }
                    })
                    .then(({ data }) => {
                        this.prolongation.isProlongation = data.is_prolongation;
                        this.prolongation.isExtensionPeriodExpired = data.is_extension_period_expired || false;
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
        },
    }
</script>
