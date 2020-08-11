export default {
    data() {
        return {
            financialCreditsTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    bank_name: {
                        type: 'UInput',

                        label: 'Bank',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-2-tablet is-6-mobile',
                    },

                    credit_purpose_id: {
                        type: 'VueSelect',
                        name: 'credit_purpose_name',
                        refDisabled: 'bank_name',
                        props: {
                            placeholder: 'Oberit typ kredytu',
                        },

                        label: 'Typ kredytu',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },

                    currency_id: {
                        type: 'VueSelect',
                        name: 'currency_name',
                        refDisabled: 'credit_purpose_id',
                        props: {
                            placeholder: 'Oberit',
                        },

                        label: 'Valyuta',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },

                    amount_total: {
                        type: 'UInput',
                        refDisabled: 'currency_id',
                        props: {
                            type: 'number',
                            step: 0.01,
                            min: 0,
                        },

                        label: 'Osnovna suma',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },

                    amount_left: {
                        type: 'UInput',
                        refDisabled: 'amount_total',
                        props: {
                            type: 'number',
                            step: 0.01,
                            min: 0,
                        },

                        label: 'Zalyshok',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    monthly_payment: {
                        type: 'UInput',
                        refDisabled: 'amount_left',
                        props: {
                            type: 'number',
                            step: 0.01,
                            min: 0,
                        },

                        label: 'Shchomisyachnyy platizh, hrn',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    number_delayed_payments: {
                        type: 'UInput',
                        refDisabled: 'monthly_payment',
                        props: {
                            type: 'number',
                            step: 0.01,
                            min: 0,
                        },

                        label: 'Kilkist prostrochen',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    early_repayment: {
                        type: 'UInput',
                        props: {
                            type: 'checkbox',
                            className: 'is-info',
                        },

                        label: 'Dostrokove pohashennya',
                        meta: {
                            boolean: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                        align: 'center',
                    },
                },
            },
        };
    },
};
