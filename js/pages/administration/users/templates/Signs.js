export default {
    data() {
        return {
            signsTemplate: {
                search: false,
                rowToAdd: true,
                columns: {
                    sign_name: {
                        type: 'UInput',
                        unique: true,

                        label: 'Nazva pidpysu',
                        meta: {
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-6-mobile',
                    },
                    sign_nominative: {
                        type: 'UInput',
                        refDisabled: 'sign_name',

                        label: 'Posada, PIB u nazyvnomu vidminku:',
                        meta: {
                            editable: {
                                type: 'text',
                                controler: true,
                            },
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    sign_genitive: {
                        type: 'UInput',
                        refDisabled: 'sign_nominative',

                        label: 'Posada, PIB u rodovomu vidminku:',
                        meta: {
                            editable: {
                                type: 'text',
                                controler: true,
                            },
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    sign_basis: {
                        model: 'sign_basis',
                        type: 'UInput',

                        label: 'Diye na pidstavi',
                        meta: {
                            editable: {
                                type: 'text',
                                controler: true,
                            },
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
