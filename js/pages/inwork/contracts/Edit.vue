<template>
    <div>
        <enso-tabs
            v-if="init"
            fullwidth
            toggle
            @selected="selectedTab($event)">

            <template #label="{ tab }">{{ tab }}</template>

            <tab
                v-for="tabItem in tabsArr"
                :key="tabItem.href"
                :id="tabItem.id"
                :default="tabItem.href === $route.name"
                :href="tabItem.href">
                <component
                    v-if="tabItem.href === $route.name"
                    :is="tabItem.component"
                    v-bind="tabItem.props"/>
            </tab>
        </enso-tabs>
    </div>
</template>

<script>
    import { Tab, EnsoTabs } from '@enso-ui/tabs/bulma'

    import CreditSolutions from './_tabs/CreditSolutions'
    import BankExpert from './_tabs/BankExpert'
    import Insurance from './_tabs/Insurance'
    import AdditionalAgreements from './_tabs/AdditionalAgreements'
    import CreditAgreement from './_tabs/CreditAgreement'
    import Documents from './_tabs/Documents'
    import Messages from './_tabs/Messages'
    import PrintForm from './_tabs/PrintForm'

    export default {
        components: {
            EnsoTabs,
            Tab,

            CreditSolutions,
            BankExpert,
            Insurance,
            AdditionalAgreements,
            CreditAgreement,
            Documents,
            Messages,
            PrintForm,
        },

        inject: ['i18n'],

        data() {
            return {
                init: false,
                tabsArr: [
                    {
                        id: this.i18n('Kredytni rishennya'),
                        href: 'inwork.contracts.edit.creditSolutions',
                        component: 'creditSolutions',
                        props: {
                            contractId: this.$route.params.contract,
                            options: {
                                client: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getAll: 'inwork.contracts.questionnaires.getClientsByContract',
                                        getById: 'inwork.contracts.questionnaires.getClientById',
                                        getBySnapshotId: 'inwork.contracts.questionnaires.getClientBySnapshotId',
                                        getStructure: 'inwork.contracts.questionnaires.getClientStructure',
                                        save: 'inwork.contracts.questionnaires.saveClientData',
                                    },
                                },

                                object: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    limit: 1,
                                    apiRoutes: {
                                        getAll: 'inwork.contracts.questionnaires.getInsuranceObjectsByContract',
                                        getBySnapshotId: 'inwork.contracts.questionnaires.getInsuranceObjectBySnapshotId',
                                        getById: 'inwork.contracts.questionnaires.getInsuranceObjectById',
                                        searchById: 'inwork.contracts.questionnaires.searchInsuranceObjectById',
                                        getStructure: 'inwork.contracts.questionnaires.getInsuranceObjectStructure',
                                        save: 'inwork.contracts.questionnaires.saveInsuranceObjectData',
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: this.i18n('Ekspert banka'),
                        href: 'inwork.contracts.edit.bankExpert',
                        component: 'bankExpert',
                        props: {
                            options: {
                                client: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getAll: 'inwork.contracts.questionnaires.getClientsByContract',
                                        getById: 'inwork.contracts.questionnaires.getClientById',
                                        getBySnapshotId: 'inwork.contracts.questionnaires.getClientBySnapshotId',
                                        getStructure: 'inwork.contracts.questionnaires.getClientStructure',
                                        save: 'inwork.contracts.questionnaires.saveClientData',
                                    },
                                },

                                object: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getAll: 'inwork.contracts.questionnaires.getInsuranceObjectsByContract',
                                        getBySnapshotId: 'inwork.contracts.questionnaires.getInsuranceObjectBySnapshotId',
                                        getById: 'inwork.contracts.questionnaires.getInsuranceObjectById',
                                        searchById: 'inwork.contracts.questionnaires.searchInsuranceObjectById',
                                        getStructure: 'inwork.contracts.questionnaires.getInsuranceObjectStructure',
                                        save: 'inwork.contracts.questionnaires.saveInsuranceObjectData',
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: this.i18n('Kredytna uhoda'),
                        href: 'inwork.contracts.edit.creditAgreement',
                        component: 'creditAgreement',
                    },
                    {
                        id: this.i18n('Strakhuvannia'),
                        href: 'inwork.contracts.edit.insurance',
                        component: 'insurance',
                        props: {
                            contractId: this.$route.params.contract,
                            options: {
                                client: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getAll: 'inwork.contracts.questionnaires.getClientsByContract',
                                        getById: 'inwork.contracts.questionnaires.getClientById',
                                        getBySnapshotId: 'inwork.contracts.questionnaires.getClientBySnapshotId',
                                        getStructure: 'inwork.contracts.questionnaires.getClientStructure',
                                        save: 'inwork.contracts.questionnaires.saveClientData',
                                    },
                                },

                                object: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getAll: 'inwork.contracts.questionnaires.getInsuranceObjectsByContract',
                                        getBySnapshotId: 'inwork.contracts.questionnaires.getInsuranceObjectBySnapshotId',
                                        getById: 'inwork.contracts.questionnaires.getInsuranceObjectById',
                                        searchById: 'inwork.contracts.questionnaires.searchInsuranceObjectById',
                                        getStructure: 'inwork.contracts.questionnaires.getInsuranceObjectStructure',
                                        save: 'inwork.contracts.questionnaires.saveInsuranceObjectData',
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: this.i18n('Dodatkovi uhody'),
                        href: 'inwork.contracts.edit.additionalAgreements',
                        component: 'additionalAgreements',
                        props: {
                            contractId: this.$route.params.contract,
                            options: {
                                client: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getById: 'inwork.contracts.additionalAgreements.clients.getById',
                                        getBySnapshotId: 'inwork.contracts.additionalAgreements.clients.getBySnapshotId',
                                        getStructure: 'inwork.contracts.additionalAgreements.clients.getStructure',
                                        save: 'inwork.contracts.additionalAgreements.clients.save',
                                    },
                                },

                                object: {
                                    params: {
                                        insurance_contract_id: this.$route.params.contract,
                                        stateAlias: 'contract',
                                    },
                                    apiRoutes: {
                                        getBySnapshotId: 'inwork.contracts.additionalAgreements.insuranceObjects.getBySnapshotId',
                                        getById: 'inwork.contracts.additionalAgreements.insuranceObjects.getById',
                                        searchById: 'inwork.contracts.questionnaires.searchInsuranceObjectById',
                                        getStructure: 'inwork.contracts.additionalAgreements.insuranceObjects.getStructure',
                                        save: 'inwork.contracts.additionalAgreements.insuranceObjects.save',
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: this.i18n('Dokumenty'),
                        href: 'inwork.contracts.edit.documents',
                        component: 'documents',
                    },
                    {
                        id: this.i18n('Povidomlennya'),
                        href: 'inwork.contracts.edit.messages',
                        component: 'messages',
                    },
                    {
                        id: this.i18n('Forma dlya druku'),
                        href: 'inwork.contracts.edit.printForm',
                        component: 'printForm',
                    },
                ],
            }
        },

        created() {
            this.initContract();
        },

        methods: {
            initContract() {
                axios.get(route('inwork.contracts.getAdditionalData'), {
                        params: {
                            contract_id: this.$route.params.contract,
                        }
                    })
                    .then(({ data }) => {
                        this.tabsArr = this.tabsArr.filter(tab => data.contractTabs.includes(tab.component));

                        this.tabsArr.some(tab => tab.href === this.$route.name)
                            ? this.init = true
                            : this.$router.push({ name: 'notFound' });
                    });
            },

            selectedTab(tabId) {
                let tab = this.tabsArr.find((item) => item.id === tabId);

                this.$router.push({ name: tab.href });
            },
        },
    }
</script>
