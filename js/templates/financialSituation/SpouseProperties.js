export default {
    data() {
        return {
            spousePropertiesTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    property_type_id: {
                        type: 'VueSelect',
                        name: 'property_type_name',
                        props: {
                            placeholder: 'Oberit',
                        },

                        label: 'Typ vlasnosti',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },

                    parameter_1: {
                        type: 'UInput',
                        refDisabled: 'property_type_id',
                        props: {
                            placeholder: '',
                        },

                        label: 'Parametr 1',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },

                    parameter_2: {
                        type: 'UInput',
                        refDisabled: 'parameter_1',
                        props: {
                            placeholder: '',
                        },

                        label: 'Parametr 2',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    parameter_3: {
                        type: 'UInput',
                        refDisabled: 'parameter_2',
                        props: {
                            placeholder: '',
                        },

                        label: 'Parametr 3',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    description: {
                        type: 'UInput',
                        refDisabled: 'parameter_3',
                        props: {
                            type: 'textarea',
                        },

                        label: 'Opys',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    property_ownership_type_id: {
                        type: 'VueSelect',
                        name: 'property_ownership_type_name',
                        refDisabled: 'description',
                        props: {
                            placeholder: 'Оберіть вид',
                        },

                        label: 'Vyd vlasnosti',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },

                    is_pawned: {
                        type: 'UInput',
                        props: {
                            type: 'checkbox',
                            className: 'is-info',
                        },

                        label: 'V zastavi',
                        meta: {
                            boolean: true,
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-6-mobile',
                        align: 'center',
                    },
                },
            },
        };
    },
};
