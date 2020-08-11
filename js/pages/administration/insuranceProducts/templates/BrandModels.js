export default {
    data() {
        return {
            productBrandModelsTemplate: {
                search: false,
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    car_brand_id: {
                        type: 'VueSelect',
                        name: 'car_brand_name',
                        props: {
                            source: route('administration.carBrands.selectOptions'),
                            placeholder: 'Oberit brend',
                        },

                        label: 'Brend',
                        meta: {
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    car_model_filter_policy_id: {
                        type: 'VueSelect',
                        name: 'car_model_filter_policy_name',
                        refDisabled: 'car_brand_id',
                        props: {
                            source: route('references.filterpolicies.selectOptions'),
                            placeholder: 'Oberit',
                        },

                        label: 'Polityka vyboru modeli',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    carModels: {
                        type: 'VueSelect',
                        name: 'car_models_name',
                        refDisabled: 'car_model_filter_policy_id',
                        props: {
                            source: route('administration.carModels.selectOptions'),
                            placeholder: 'Oberit model',
                            multiple: true,
                        },

                        label: 'Model',
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
