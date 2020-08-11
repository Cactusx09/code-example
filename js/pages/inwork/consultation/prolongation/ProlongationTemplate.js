export default {
    data() {
        return {
            prolongationTemplate: {
                // dtRowId: 'calculation_id',
                actions: {
                    remove: false,
                },
                search: false,
                columns: {
                    insurer_name: {
                        label: 'Strakhuvalnyk',
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurance_object_names: {
                        label: 'Avto',
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurance_object_vin_codes: {
                        label: 'Shasi',
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    product_subtype_name: {
                        label: 'Vyd strakhuvannya',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurance_contract_code: {
                        label: 'Nomer dohovoru',
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    policy_begin_datetime: {
                        label: 'Data pochatku',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    policy_end_datetime: {
                        label: 'Data zakinchennya',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                },
            },
        };
    },
};
