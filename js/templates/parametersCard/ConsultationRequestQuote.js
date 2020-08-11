export default {
    data() {
        return {
            insuranceProductTemplate: {
                actions: {
                    remove: false,
                },
                search: false,
                columns: {
                    product_code: {
                        label: 'Kod produktu',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-5-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    product_name: {
                        label: 'Nazva',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-6-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    // product_description: {
                    //     label: 'Opys produktu',
                    //     meta: {
                    //         searchable: false,
                    //         sort: null,
                    //         sortable: false,
                    //     },
                    //     class: 'is-4-fullhd is-3-widescreen is-3-desktop is-3-tablet is-6-mobile',
                    // },
                    // program_name: {
                    //     label: 'Nazva prohramy',
                    //     meta: {
                    //         searchable: false,
                    //         sort: null,
                    //         sortable: false,
                    //     },
                    //     class: 'is-2-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    // },
                },
            },
        };
    },
};
