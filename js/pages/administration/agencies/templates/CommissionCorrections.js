export default {
    data() {
        return {
            commissionCorrectionsTemplate: {
                // dtRowId: 'commission_correction_id',
                rowToAdd: true,
                columns: {
                    commission_type_id: {
                        type: 'VueSelect',
                        name: 'commission_type_name',
                        props: {
                            source: route('references.commissiontypes.selectOptions'),
                            placeholder: 'Oberit typ komisiyi',
                        },

                        label: 'Typ komisiyi',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-5-fullhd is-5-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    commission_correction_type_id: {
                        type: 'VueSelect',
                        name: 'commission_correction_type_name',
                        refDisabled: 'commission_type_id',
                        props: {
                            source: route('references.commissioncorrectiontypes.selectOptions'),
                            placeholder: 'Oberit vyd korehuvannya',
                        },

                        label: 'Vyd koryhuvannya',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    value: {
                        type: 'UInput',
                        refDisabled: 'commission_correction_type_id',
                        props: {
                            default: 1,
                            type: 'number',
                            round: 0,
                            min: 0,
                        },

                        label: 'Koryhuyuchyy koefitsiyent',
                        meta: {
                            editable: {
                                type: 'number',
                                controler: true,
                                round: 2,
                                min: 0,
                            },
                        },
                        class: 'is-2-fullhd is-2-widescreen is-4-desktop is-3-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
