export default {
    data() {
        return {
            policyCalculationCommissionsTemplate: {
                actions: {
                    remove: false,
                },
                search: false,
                columns: {
                    agency_code: {
                        label: 'Kod produktu',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-5-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    agency_name: {
                        label: 'Nazva',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-6-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
