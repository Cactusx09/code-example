export default {
    data() {
        return {
            productBankAccountTemplate: {
                search: false,
                columns: {
                    bank_name: {
                        label: 'Nazva banku',
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                        meta: {},
                    },
                    mfo: {
                        label: 'MFO banku',
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-3-tablet is-6-mobile',
                        meta: {},
                    },
                    account_account: {
                        label: 'Nomer rakhunku',
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-3-tablet is-6-mobile',
                        meta: {},
                    },
                    account_description: {
                        label: 'Opys rakhunku',
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-12-tablet is-12-mobile',
                        meta: {},
                    },
                },
            },
        };
    },
};
