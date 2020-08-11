export default {
    data() {
        return {
            evaluateTemplate: {
                // search: {
                //     class: 'is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-12-mobile',
                // },
                actions: false,
                columns: {
                    name: {
                        label: 'Parametr',
                        meta: {
                            sortable: false,
                            searchable: true,
                        },
                        class: 'is-6-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    user_value: {
                        label: 'Znachennya korystuvacha',
                        meta: {
                            searchable: false,
                            sortable: false,
                            editable: {
                                input: 'number',
                            },
                        },
                        class: 'is-3-fullhd is-4-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    result_calculat: {
                        label: 'Rezultat obchyslen',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-4-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
