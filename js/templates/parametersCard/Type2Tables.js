export default {
    data() {
        return {
            productsTableTemplate: {
                actions: {
                    remove: false,
                    class: 'is-1-fullhd is-1-widescreen is-1-desktop is-1-tablet is-12-mobile',
                },
                highlighted: 'product_is_quoted',
                columns: {
                    bank: {
                        label: 'Bank',
                        meta: {
                            searchable: true,
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-3-tablet is-12-mobile',
                    },
                    product_rate: {
                        label: 'Avans / Strok / Stavka, %',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-3-desktop is-5-tablet is-12-mobile',
                    },
                    parameters: {
                        label: 'Parametry',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-4-tablet is-12-mobile',
                    },
                    linkedProducts: {
                        label: 'Povyazani produkty',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-5-fullhd is-5-widescreen is-4-desktop is-11-tablet is-12-mobile',
                    },
                },
            },
            linkedProductsTableTemplate: {
                search: false,
                actions: false,
                columns: {
                    calculations: {
                        label: 'Vybir strakhovoho produktu',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-12',
                    },
                },
            },
            selectedProductsTableTemplate: {
                actions: {
                    remove: true,
                    class: 'is-1-fullhd is-1-widescreen is-1-desktop is-1-tablet is-12-mobile',
                },
                search: false,
                highlighted: 'product_is_quoted',
                columns: {
                    bank: {
                        label: 'Bank',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-3-tablet is-12-mobile',
                    },
                    productRateString: {
                        label: 'Avans / Strok / Stavka, %',
                        meta: {
                            searchable: false,
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-3-desktop is-5-tablet is-12-mobile',
                    },
                    parameters: {
                        label: 'Parametry',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-4-tablet is-12-mobile',
                    },
                    linkedProducts: {
                        label: 'Povyazani produkty',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-5-fullhd is-5-widescreen is-4-desktop is-11-tablet is-12-mobile',
                    },
                },
            },
            selectedLinkedProductsTableTemplate: {
                search: false,
                actions: false,
                columns: {
                    selectedCalculations: {
                        label: 'Obrani produkty',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-12',
                    },
                },
            },
        };
    },
};
