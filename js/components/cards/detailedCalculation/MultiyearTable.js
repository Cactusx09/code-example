export default {
    data() {
        return {
            multiyearTableTemplate: {
                // dtRowId: 'id',
                search: false,
                actions: {
                    remove: false,
                },
                columns: {
                    policy_begin_datetime: {
                        label: 'Data pochatku',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    total_insurance_price: {
                        label: 'Zahalna strakhova suma',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    insurance_rate: {
                        label: 'Taryf',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    total_reward: {
                        label: 'Strakhova premiya',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    product_name: {
                        label: 'Nazva produktu',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
