export default {
    data() {
        return {
            productLinkedProductsTemplate: {
                search: false,
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    product_class_id: {
                        type: 'VueSelect',
                        name: 'product_class_name',
                        props: {
                            source: route('administration.productClasses.selectOptions'),
                            placeholder: 'Vyberit napravlennya',
                        },

                        label: 'Napravlennya',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    product_type_id: {
                        type: 'VueSelect',
                        name: 'product_type_name',
                        refDisabled: 'product_class_id',
                        props: {
                            source: route('administration.productTypes.selectOptions'),
                            placeholder: 'Vyberit typ produktu',
                        },

                        label: 'Typ produktu',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    product_subtype_id: {
                        type: 'VueSelect',
                        name: 'product_subtype_name',
                        refDisabled: 'product_type_id',
                        props: {
                            source: route('administration.productSubtypes.selectOptions'),
                            placeholder: 'Vyberit pidtyp produktu',
                        },

                        label: 'Pidtyp produktu',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    insurance_program_id: {
                        type: 'VueSelect',
                        name: 'insurance_program_name',
                        refDisabled: 'product_subtype_id',
                        props: {
                            source: route('administration.insurancePrograms.selectOptions'),
                            placeholder: 'Vyberit prohramu',
                        },

                        label: 'Prohrama strakhuvannya',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    linked_products: {
                        type: 'VueSelect',
                        name: 'linked_products_multiple',
                        refDisabled: 'insurance_program_id',
                        props: {
                            label: 'product_name',
                            source: route('insuranceProduct.selectOptions'),
                            placeholder: 'Oberit povyazani produkty',
                            multiple: true,
                        },

                        label: 'Povyazani produkty',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
