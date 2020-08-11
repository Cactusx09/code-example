<template>
    <div class="consultation">
        <wizard :wizard-structure="wizards">

            <template #clients>
                <clients-wizard
                    :options="options.client"
                    financial-situation/>
            </template>

            <template #insuranceObjects>
                <insurance-objects-wizard
                    :options="options.object"/>
            </template>

            <template #сalculationCard>
                <calculation-card
                    :data="data.сalculationCard"
                    :contract-id="$route.params.contract"
                    @submit="getCalculationCard()"/>
            </template>
        </wizard>
    </div>
</template>

<script>
import Wizard from '@components/Wizard'

import ClientsWizard from '@components/cards/clients/ClientsWizard'
import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

import Card from '@components/cards/Card'
import CalculationCard from '@components/cards/calculationCard/Card'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        Wizard,

        ClientsWizard,
        InsuranceObjectsWizard,

        Card,
        CalculationCard,
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
            contractId: this.$route.params.contract,

            data: {
                сalculationCard: {},
            },
            wizards: {
                clients: [],
                insuranceObjects: [],
                сalculationCard: {},
            }
        }
    },
    created() {
        this.getCalculationCard();
    },
    methods: {
        getCalculationCard() {
            axios.get(route('inwork.contracts.bankExpert.getCalculationCard'), {
                    params: {
                        insurance_contract_id: this.$route.params.contract,
                    }
                })
                .then(({ data }) => {
                    this.data.сalculationCard = data;
                    // this.wizards.сalculationCard = data.wizard;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
}
</script>

<style lang="sass">

</style>
