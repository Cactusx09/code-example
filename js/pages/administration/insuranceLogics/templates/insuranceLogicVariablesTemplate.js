export default {
    data() {
        return {
            insuranceLogicVariablesTemplate: {
                columns: {
                    name: {
                        label: 'Parametr',
                        meta: {
                            sortable: false,
                            searchable: true,
                        },
                        class: 'is-3-fullhd is-4-widescreen is-4-desktop is-6-tablet is-12-mobile',
                    },
                    description: {
                        label: 'Opys',
                        meta: {
                            searchable: false,
                            sortable: false,
                        },
                        class: 'has-text-left is-8-fullhd is-7-widescreen is-7-desktop is-6-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
