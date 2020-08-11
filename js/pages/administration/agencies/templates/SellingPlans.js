export default {
    data() {
        return {
            sellingPlansTemplate: {
                search: false,
                columns: {
                    period: {
                        label: 'Misyats',
                        meta: {
                            sort: null,
                            sortable: false,
                            replaceable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    plan_pcs: {
                        label: 'Plan, sht',
                        meta: {
                            searchable: false,
                            sortable: false,
                            editable: {
                                type: 'number',
                                controler: true,
                                round: 0,
                                min: 0,
                                after: 'st',
                            },
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },
                    fact_pcs: {
                        label: 'Fakt, sht',
                        meta: {
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-3-tablet is-6-mobile',
                    },
                    procent_pcs: {
                        label: 'Vykonano, % sht',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-3-tablet is-6-mobile',
                    },
                    plan_uah: {
                        label: 'Plan, hrn',
                        meta: {
                            searchable: false,
                            sortable: false,
                            editable: {
                                type: 'number',
                                controler: true,
                                round: 2,
                                min: 0,
                                after: 'hrn',
                            },
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },
                    fact_uah: {
                        label: 'Fakt, hrn',
                        meta: {
                            sortable: false,
                            replaceable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-3-tablet is-6-mobile',
                    },
                    procent_uah: {
                        label: 'Vykonano, % hrn',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-3-tablet is-6-mobile',
                    },
                    correction_coefficient: {
                        label: 'Koefitsiyent',
                        meta: {
                            sortable: false,
                            replaceable: true,
                            editable: {
                                type: 'number',
                                controler: true,
                                round: 2,
                                min: 0,
                            },
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },
                    comment: {
                        label: 'Komentari',
                        meta: {
                            sortable: false,
                            replaceable: true,
                            editable: {
                                type: 'textarea',
                                default: '',
                                placeholder: 'Vvedit prymitky',
                            },
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
