export default {
    data() {
        return {
            productInsuranceLogicTemplate: {
                search: false,
                columns: {
                    code: {
                        label: 'Code',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-4-tablet is-12-mobile',
                    },
                    name: {
                        label: 'Назва',
                        meta: {
                            searchable: false,
                            sort: null,
                            sortable: false,
                        },
                        class: 'is-7-fullhd is-7-widescreen is-7-desktop is-7-tablet is-12-mobile',
                    },
                },
            },
        };
    },
};
