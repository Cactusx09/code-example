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
                    product_code: {
                        label: 'Kod',
                        meta: {
                            searchable: true,
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-12-mobile',
                    },
                    product_name: {
                        label: 'Prohrama strakhuvannya',
                        meta: {
                            searchable: true,
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-3-tablet is-12-mobile',
                    },
                    calculations: {
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-7-fullhd is-7-widescreen is-7-desktop is-6-tablet is-12-mobile',
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
                    product_code: {
                        label: 'Kod',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-1-desktop is-2-tablet is-12-mobile',
                    },
                    product_name: {
                        label: 'Prohrama strakhuvannya',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-3-tablet is-12-mobile',
                    },
                    selectedCalculations: {
                        label: 'Vybrani produkty',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-7-fullhd is-7-widescreen is-7-desktop is-6-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
