export default {
    data() {
        return {
            accessTemplateTemplate: {
                search: false,
                isMultipleSelectConvertStructure: true,
                rowToAdd: 'line_id',
                columns: {
                    product_type_id: {
                        type: 'VueSelect',
                        name: 'product_type_name',
                        props: {
                            source: route('administration.productTypes.selectOptions'),
                            placeholder: 'Oberit type producty',
                        },

                        label: 'Typ prodycty',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    brand_policy_id: {
                        type: 'VueSelect',
                        name: 'brand_policy_name',
                        refDisabled: 'product_type_id',
                        props: {
                            source: route('references.filterpolicies.selectOptions'),
                            placeholder: 'Oberit',
                        },

                        label: 'Polityka vyboru brendy',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    brand_ids: {
                        type: 'VueSelect',
                        name: 'brand_name',
                        refDisabled: 'brand_policy_id',
                        props: {
                            source: route('administration.carBrands.selectOptions'),
                            placeholder: 'Oberit brend',
                            multiple: true,
                        },

                        label: 'Brend',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-7-fullhd is-5-widescreen is-5-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
