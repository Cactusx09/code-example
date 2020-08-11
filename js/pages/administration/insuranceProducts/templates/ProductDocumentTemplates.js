export default {
    data() {
        return {
            productDocumentTemplatesTemplate: {
                search: false,
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
                            searchable: true,
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    printing_form_id: {
                        // type: 'UInput',
                        name: 'qualified_name',
                        refDisabled: 'person_type_id',
                        props: {
                            placeholder: 'Universalnyy poshuk po dokumentam',
                        },

                        label: 'Shablon',
                        meta: {
                            searchable: true,
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-7-fullhd is-7-widescreen is-7-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
