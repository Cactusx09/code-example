export default {
    data() {
        return {
            signerTemplate: {
                search: false,
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    user_id: {
                        type: 'VueSelect',
                        name: 'user_name',
                        props: {
                            source: route('administration.users.options'),
                            placeholder: 'Oberit pidpysanta',
                            label: 'name',
                        },

                        label: 'Pidpysanty',
                        meta: {
                            sortable: false,
                        },
                        class: 'user_name is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    printing_form_types: {
                        type: 'VueSelect',
                        name: 'printing_form_types_multiple',
                        refDisabled: 'user_id',
                        props: {
                            placeholder: 'Oberit typ shablonu',
                            options: [],
                            multiple: true,
                        },

                        label: 'Typ shablonu',
                        meta: {
                            replaceable: true,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    sign_alias: {
                        type: 'VueSelect',
                        name: 'sign_alias_name',
                        refDisabled: 'user_id',
                        props: {
                            options: [],
                            placeholder: 'Oberit typ pidpysu',
                        },

                        label: 'Typ pidpysu',
                        meta: {
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    user_sign_id: {
                        type: 'VueSelect',
                        name: 'user_sign_name',
                        refDisabled: 'sign_alias',
                        props: {
                            source: route('references.userSigns.selectOptions'),
                            placeholder: 'Oberit pidpys',
                        },

                        label: 'Pidpys',
                        meta: {
                            replaceable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
