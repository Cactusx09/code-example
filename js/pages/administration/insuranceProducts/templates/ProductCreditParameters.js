export default {
    data() {
        return {
            productCreditParametersTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    credit_period_id: {
                        type: 'VueSelect',
                        name: 'credit_period_name',
                        props: {
                            source: route('references.creditPeriods.selectOptions'),
                            placeholder: 'Oberit period kredytuvannya',
                        },

                        label: 'Period kredytuvannya',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    credit_prepayment_id: {
                        type: 'VueSelect',
                        name: 'credit_prepayment_name',
                        refDisabled: 'credit_period_id',
                        props: {
                            source: route('references.creditPrepayments.selectOptions'),
                            placeholder: 'Oberit avans',
                        },

                        label: 'Avans',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    rate: {
                        type: 'UInput',
                        refDisabled: 'credit_prepayment_id',
                        props: {
                            type: 'number',
                            default: 0,
                            step: 1,
                            min: 0,
                            max: 100,
                            after: ' %',
                        },

                        label: 'Richna stavka %',
                        meta: {
                            sortable: false,
                            editable: {
                                type: 'number',
                                default: 0,
                                step: 1,
                                min: 0,
                                max: 100,
                            },
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
