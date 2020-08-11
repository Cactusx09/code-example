export default {
    data() {
        return {
            consultationHistoryTemplate: {
                actions: {
                    remove: false,
                },
                columns: {
                    product_status: {
                        label: 'Pidtyp / Prohrama <br>Status',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-3-desktop is-4-tablet is-11-mobile',
                    },
                    consultation_date: {
                        label: 'Data / Chas <br>konsultatsiyi',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-12-desktop is-12-tablet is-12-mobile is-collapsable',
                    },
                    calculation_code: {
                        label: 'Konsultatsiya / Rozrakhunok <br>kod',
                        meta: {
                            searchable: true,
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-12-desktop is-12-tablet is-12-mobile is-collapsable',
                    },
                    contract_date: {
                        label: 'Data / Chas <br>dohovoru',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-12-desktop is-12-tablet is-12-mobile is-collapsable',
                    },
                    contract_code: {
                        label: 'Dohovir <br>kod',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-12-tablet is-12-mobile is-collapsable',
                    },
                    insurance_object: {
                        label: 'Obyekt strakhuvannya',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-2-desktop is-2-tablet is-12-mobile is-collapsable',
                    },
                    product_parameters: {
                        label: 'Parametry produktu',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-5-desktop is-5-tablet is-12-mobile is-collapsable',
                    },
                    agency: {
                        label: 'Ahentsiya',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-12-desktop is-12-tablet is-12-mobile is-collapsable',
                    },
                    agent: {
                        label: 'Ahent',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-12-desktop is-12-tablet is-12-mobile is-collapsable',
                    },
                },
            },
        };
    },
};
