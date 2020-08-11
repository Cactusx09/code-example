export default {
    data() {
        return {
            relatedCalculationsTemplate: {
                // dtRowId: 'calculation_id',
                search: false,
                actions: false,
                columns: {
                    calculation_code: {
                        label: 'Nomer dohovoru',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    created_at: {
                        label: 'Data strakhuvannya',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurer_display_name: {
                        label: 'Strakhuvalnyk',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurance_object_display_name: {
                        label: 'Obyekt strakhuvannya',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    total_insurance_price: {
                        label: 'Suma, hrn',
                        class: 'related-calculation-is-3of2 is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurance_total_reward: {
                        label: 'Taryf',
                        class: 'related-calculation-is-3of2 is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    insurance_rate: {
                        label: 'Premiya, hrn',
                        class: 'related-calculation-is-3of2 is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    policy_begin_datetime: {
                        label: 'Pochatok',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    policy_interrupt_datetime: {
                        label: 'Zakinchennya',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    status_name: {
                        label: 'Status',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    creator_agency_name: {
                        label: 'Ahentsiya-avto',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    seller_agency_name: {
                        label: 'Ahentsiya-prod',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                    updated_at: {
                        label: 'Redahovano',
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-12-mobile',
                        meta: {},
                    },
                },
            },
        };
    },
};
