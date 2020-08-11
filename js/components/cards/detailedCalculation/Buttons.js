export default {
    data: () => ({
        buttons: {
            editCalculation: {
                label: 'Redahuvaty',
                class: 'is-warning',
            },
            quoteCalculationRequest: {
                label: 'Zapyt kotyruvan',
                class: 'is-info',
            },
            quoteCalculation: {
                label: 'Kotyruvaty',
                class: 'is-info',
            },
            detailedCalculationInterrupted: {
                label: 'Zapyt dostrokov prypynyty',
                class: 'is-danger',
            },
            detailedCalculationSpoil: {
                label: 'Zipsuvaty',
                class: 'is-danger',
            },
            detailedCalculationDuplicate: {
                label: 'Dublikat',
                class: 'is-danger',
            },
            detailedCalculationRearranged: {
                label: 'Pereuklasty',
                class: 'is-danger',
            },
            detailedCalculation: {
                label: 'Vvesty v diyu',
                class: 'is-success mr-lf_auto',
            },
            formContractCalculationConfirmation: {
                label: 'Sformuvaty',
                class: 'is-success',
            },
            detailedCalculationProlongation: {
                label: 'Stvoryty prolonhatsiyu',
                class: 'is-info',
                disabled: 'prolongation',
            },
            detailedCalculationDU: {
                label: 'Stvoryty DU',
                class: 'is-info',
                disabled: true,
            },
        },
    }),
}
