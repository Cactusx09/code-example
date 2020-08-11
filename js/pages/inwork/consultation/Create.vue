<template>
    <div class="consultation">
        <wizard :wizard-structure="wizards">

            <template #clients>
                <clients-wizard
                    :options="options.client"
                    @loaded="wizards.clients = $event.wizard"
                    @saved="$router.push({
                        name: 'inwork.consultation.edit',
                        params: {
                            consultation: $event.consultation_id,
                        },
                    })"/>
            </template>

            <template #insuranceObjects>
                <insurance-objects-wizard
                    :options="options.object"
                    @loaded="wizards.insuranceObjects = $event.wizard"
                    @saved="$router.push({
                        name: 'inwork.consultation.edit',
                        params: {
                            consultation: $event.consultation_id,
                        },
                    })"/>
            </template>

        </wizard>
    </div>
</template>

<script>
import Wizard from '@components/Wizard';

import ClientsWizard from '@components/cards/clients/ClientsWizard'
import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

export default {
    components: {
        Wizard,

        ClientsWizard,
        InsuranceObjectsWizard,
    },

    inject: ['i18n'],

    data() {
        return {
            options: {
                client: {
                    params: {
                        consultation_id: this.$route.params.consultation,
                        stateAlias: 'consultation',
                    },
                    apiRoutes: {
                        getById: 'inwork.consultations.getClientById',
                        getStructure: 'inwork.consultations.getClientStructure',
                        save: 'inwork.consultations.saveClientData',
                    },
                },
                object: {
                    params: {
                        consultation_id: this.$route.params.consultation,
                        stateAlias: 'consultation',
                    },
                    apiRoutes: {
                        getById: 'inwork.consultations.getInsuranceObjectById',
                        searchById: 'inwork.consultations.searchInsuranceObjectById',
                        getStructure: 'inwork.consultations.getInsuranceObjectStructure',
                        save: 'inwork.consultations.saveInsuranceObjectData',
                    },
                },
            },

            wizards: {
                clients: [],
                insuranceObjects: [],
            },
        };
    },
}
</script>

<style lang="sass">

</style>
