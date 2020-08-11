export default {
    data() {
        return {
            policyDistributedBalanceTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    number: {
                        type: 'UInput',
                        props: {
                            type: 'number',
                        },

                        label: 'Dohovir (stvorenyy)',
                        class: 'is-6',
                        meta: {
                            sortable: true,
                        },
                    },
                    amount: {
                        type: 'UInput',
                        refDisabled: 'number',
                        props: {
                            type: 'number',
                        },

                        label: 'Zalyshok, hrn',
                        class: 'is-5',
                        meta: {
                            sortable: true,
                        },
                    },
                },
            },
        };
    },
};
