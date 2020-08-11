export default {
    data() {
        return {
            productUTableTemplate: {
                search: false,
                columns: {
                    code: {
                        label: 'Kod',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    name: {
                        label: 'Nazva',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    description: {
                        label: 'Opys',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
