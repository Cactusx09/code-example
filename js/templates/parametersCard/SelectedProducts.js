export default {
    data() {
        return {
            selectedProductsTemplate: {
                actions: {
                    remove: false,
                },
                search: false,
                columns: {
                    product_status: {
                        label: 'Status',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-1-fullhd is-1-widescreen is-2-desktop is-3-tablet is-6-mobile',
                    },
                    bank: {
                        label: 'Bank',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-1-desktop is-2-tablet is-6-mobile',
                    },
                    productRateString: {
                        label: 'Avans / Strok / Stavka, %',
                        placeholder: 'Obraty',
                        meta: {
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    parameters: {
                        label: 'Parametry',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-1-desktop is-6-tablet is-6-mobile',
                    },
                    linkedProducts: {
                        label: 'Povyazani produkty',
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                    },
                },
            },
            selectedLinkedProductsTableTemplate: {
                actions: false,
                search: false,
                columns: {
                    selectedCalculations: {
                        label: 'Obrani produkty',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-9-fullhd is-9-widescreen is-9-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
