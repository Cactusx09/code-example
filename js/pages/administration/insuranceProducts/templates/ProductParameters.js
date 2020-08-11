export default {
    data() {
        return {
            productParametersTemplate: {
                rowToAdd: true,
                columns: {
                    product_parameter_group_id: {
                        name: 'product_parameter_group_name',
                        type: 'VueSelect',
                        props: {
                            source: route('system.productParameterGroups.selectOptions'),
                            placeholder: 'Oberit hrupu',
                        },

                        label: 'Hrupa parametriv',
                        meta: {
                            sortable: true,
                            searchable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    product_parameter_id: {
                        name: 'product_parameter_name',
                        type: 'VueSelect',
                        refDisabled: 'product_parameter_group_id',
                        props: {
                            source: route('system.productParameters.selectOptions'),
                            placeholder: 'Oberit parametr',
                        },

                        label: 'Parametr',
                        meta: {
                            sortable: true,
                            replaceable: true,
                            searchable: true,
                        },
                        class: 'is-5-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    value: {
                        type: 'UInput',
                        refDisabled: 'product_parameter_id',
                        props: {
                            type: 'number',
                            step: 1,
                            min: 0,
                            default: 0,
                            placeholder: 'Znachennya',
                        },

                        label: 'Znachennya',
                        meta: {
                            searchable: false,
                            editable: {
                                type: 'number',
                                step: 1,
                                min: 0,
                            },
                        },
                        class: 'is-2-fullhd is-3-widescreen is-3-desktop is-3-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
