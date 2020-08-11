export default {
    data() {
        return {
            productRequiredDocumentsTemplate: {
                search: false,
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    person_type_id: {
                        type: 'VueSelect',
                        name: 'person_type_name',
                        props: {
                            source: route('references.persontypes.selectOptions'),
                            placeholder: 'Oberit typ kliyenta',
                        },

                        label: 'Typ kliyenta',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    client_role_id: {
                        type: 'VueSelect',
                        name: 'client_role_name',
                        refDisabled: 'person_type_id',
                        props: {
                            source: route('references.clientRoles.selectOptions'),
                            placeholder: 'Oberit vlasnyka',
                        },

                        label: 'Vlasnyk',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-3-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    document_types: {
                        name: 'document_types_multiple',
                        type: 'VueSelect',
                        refDisabled: 'client_role_id',
                        props: {
                            source: route('references.clientDocumentTypes.selectOptions'),
                            placeholder: 'Oberit typ dokumenta',
                            multiple: true,
                        },

                        label: 'Typ dokumenta',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-5-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
