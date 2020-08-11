export default {
    data() {
        return {
            productPaymentLimitsTemplate: {
                rowToAdd: true,
                columns: {
                    value: {
                        type: 'UInput',
                        props: {
                            type: 'number',
                            default: 0,
                            round: 0,
                            min: 0,
                            after: ' %',
                        },

                        label: 'Limit vyplat DSTsV',
                        meta: {
                            sortable: true,
                            searchable: true,
                            replaceable: true,
                        },
                        class: 'is-5-fullhd is-5-widescreen is-5-desktop is-6-tablet is-6-mobile',
                    },
                    correction_coefficient: {
                        type: 'UInput',
                        props: {
                            type: 'number',
                            default: 0,
                            round: 2,
                            min: 0,
                            max: 1,
                            after: ' %',
                        },
                        refDisabled: 'value',

                        label: 'Koryhuyuchyy koefitsiyent',
                        name: 'correction_coefficient',
                        meta: {
                            sortable: true,
                            searchable: true,
                        },
                        class: 'is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
