export default {
    data() {
        return {
            calculationCommissionsTemplate: {
                dtRowId: 'row_id',
                search: false,
                actions: {
                    remove: false,
                },
                columns: {
                    act_date: {
                        label: 'Data акту',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    act_number: {
                        label: 'Номер акту',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    agent_displayname: {
                        label: 'ПІБ контрагента',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    agent_commission_type: {
                        label: 'Тип контрагента',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile',
                    },
                    actual_commission_value: {
                        label: '%',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile',
                    },
                    desired_commission_reward: {
                        label: 'Бажана комісія, грн',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile',
                    },
                    plan_performance_value: {
                        label: 'Виконання плану',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile',
                    },
                    actual_commission_reward: {
                        label: 'Фактична комісія, грн',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile',
                    },
                    payment_status: {
                        label: 'Оплата',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
