export default {
    data() {
        return {
            franchisesOsagoTemplate: {
                productType: 'vehicleOsago',
                rowToAdd: true,
                columns: {
                    product_car_type_id: {
                        type: 'VueSelect',
                        name: 'product_car_type_name',
                        props: {
                            source: route('references.productcartypes.selectOptions'),
                            placeholder: 'Oberit typ TZ',
                        },

                        label: 'Typ TZ',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-4-fullhd is-5-widescreen is-5-desktop is-6-tablet is-6-mobile',
                    },
                    other_risk_franchise_value: {
                        refDisabled: 'product_car_type_id',
                        numberProps: {
                            type: 'number',
                            step: 0.01,
                            min: 0,
                            placeholder: '0.0',
                            default: 0,
                        },
                        selectProps: {
                            options: [
                                {
                                    id: 1,
                                    name: '%',
                                },
                                {
                                    id: 2,
                                    name: this.i18n('hrn'),
                                },
                            ],
                            default: 1,
                            disableClear: true,
                        },

                        label: 'Inshi ryzyky',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-2-tablet is-6-mobile',
                    },
                    other_risk_coefficient_value: {
                        type: 'UInput',
                        refDisabled: 'other_risk_franchise_value',
                        props: {
                            type: 'number',
                            default: 0,
                            step: 0.01,
                            min: 0,
                            placeholder: '0.0',
                        },

                        label: 'Inshi ryzyky',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-3-fullhd is-2-widescreen is-2-desktop is-2-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
