export default {
    data() {
        return {
            documentsTableTemplate: {
                // dtRowId: 'media_id',
                search: false,
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    created_at: {
                        type: 'text',

                        label: 'Data stvorennya',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-3-desktop is-3-tablet is-6-mobile',
                    },
                    person_type_id: {
                        type: 'VueSelect',
                        name: 'person_type_name',
                        props: {
                            placeholder: 'Oberit typ kliyenta',
                        },

                        label: 'Typ kliyenta',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    client_role_id: {
                        type: 'VueSelect',
                        name: 'client_role_name',
                        refDisabled: 'person_type_id',
                        props: {
                            placeholder: 'Oberit vlasnyka',
                        },

                        label: 'Vlasnyk',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    client_document_types: {
                        type: 'VueSelect',
                        name: 'client_document_types_ids',
                        refDisabled: 'client_role_id',
                        props: {
                            source: route('references.clientDocumentTypes.selectOptions'),
                            placeholder: 'Oberit typ dokumenta',
                            multiple: true,
                        },

                        label: 'Typy dokumentu',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    description: {
                        type: 'UInput',
                        props: {
                            class: 'textarea',
                            type: 'textarea',
                        },

                        label: 'Opys',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    file: {
                        type: 'Uploader',
                        // source: 'inwork.contracts.documents.uploadFile',
                        refDisabled: 'client_document_types',
                        props: {
                            placeholder: 'Oberit fayl',
                        },

                        label: 'Fayl',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    created_by_name: {
                        type: 'text',

                        label: 'Kym stvoreno',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
