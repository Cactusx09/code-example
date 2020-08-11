export default {
    data() {
        return {
            templatePrintForms: {
                // dtRowId: 'insurance_contract_printing_form_id',
                actions: {
                    remove: false,
                },
                search: false,
                columns: {
                    entity_datetime: {
                        label: 'Data/chas dohovoru',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-4-desktop is-6-tablet is-12-mobile',
                    },
                    entity_code: {
                        label: 'Nomer dohovoru',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                    },
                    calculation_product_subtype: {
                        label: 'Pidtyp produktu',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    calculation_product_name: {
                        label: 'Nazva produktu',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    entity_notes: {
                        label: 'Prymitky',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    printing_form_name: {
                        label: 'Nazva dokumenta',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
