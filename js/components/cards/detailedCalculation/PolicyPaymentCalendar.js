export default {
    data() {
        return {
            policyPaymentCalendarTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    payment_planned_datetime: {
                        type: 'Datepicker',
                        props: {
                            time: true,
                            format: 'd.m.Y H:i',
                            placeholder: 'Oberit datu splaty',
                            locale: this.$store.getters['preferences/lang'],
                        },

                        label: 'Data splaty',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    amount: {
                        type: 'UInput',
                        refDisabled: 'payment_planned_datetime',
                        props: {
                            type: 'number',
                            placeholder: 'Oberit sumu',
                        },

                        label: 'Suma',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    billing_url: {
                        label: 'Rakhunok',
                        name: 'billing_url',
                        meta: {
                            sortable: false,
                        },
                        class: 'table-actions actions is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },
                    status_id: {
                        name: 'status_name',
                        type: 'VueSelect',
                        refDisabled: 'amount',
                        props: {
                            placeholder: 'Oberit status',
                            options: [],
                        },

                        label: 'Status',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    type_id: {
                        name: 'type_name',
                        type: 'VueSelect',
                        refDisabled: 'status_id',
                        props: {
                            placeholder: 'Oberit vyd platezhu',
                            options: [],
                        },

                        label: 'Vyd platezhu',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    payment_reception_datetime: {
                        // type: 'UInput',
                        // props: {
                        //     time: true,
                        //     format: 'd.m.Y H:i',
                        //     placeholder: 'Oberit datu otrymannya',
                        // },

                        label: 'Data otrymannya',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
