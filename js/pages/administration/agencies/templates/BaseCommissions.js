export default {
    data() {
        return {
            baseCommissionsTemplate: {
                // dtRowId: 'base_commission_id',
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
                        class: 'is-5-fullhd is-5-widescreen is-5-desktop is-6-tablet is-6-mobile',
                    },
                    value: {
                        type: 'UInput',
                        refDisabled: 'commission_type_id',
                        props: {
                            type: 'number',
                            placeholder: 'Znachennya',
                            round: 2,
                            min: 0,
                            max: 100,
                            after: ' %',
                        },

                        label: 'Bazova komisiya %',
                        meta: {
                            editable: {
                                type: 'number',
                                controler: true,
                                round: 2,
                                min: 0,
                                max: 100,
                                after: ' %',
                            },
                        },
                        class: 'is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
