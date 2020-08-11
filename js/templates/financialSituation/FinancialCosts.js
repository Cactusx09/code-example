export default {
    data() {
        return {
            financialCostsTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    amount: {
                        type: 'UInput',
                        props: {
                            type: 'number',
                            default: 0,
                            step: 0.01,
                            min: 0,
                        },

                        label: 'Vytraty, hrn.',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-2-tablet is-6-mobile',
                    },

                    cost_type_id: {
                        type: 'VueSelect',
                        name: 'cost_type_name',
                        refDisabled: 'amount',
                        props: {
                            placeholder: 'Oberit typ vytrat',
                        },

                        label: 'Dzherela vytrat',
                        meta: {
                            searchable: true,
                            sortable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },

                    description: {
                        type: 'UInput',
                        props: {
                            type: 'textarea',
                        },

                        label: 'Opys',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-5-fullhd is-5-widescreen is-5-desktop is-2-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
