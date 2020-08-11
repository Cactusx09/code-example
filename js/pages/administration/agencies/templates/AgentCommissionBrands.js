export default {
    data() {
        return {
            agentCommissionBrandsTemplate: {
                search: true,
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    user_id: {
                        type: 'VueSelect',
                        name: 'user_full_name',
                        props: {
                            source: route('administration.users.options'),
                            placeholder: 'Oberit PIB',
                            label: 'name',
                        },

                        label: 'PIB',
                        meta: {
                            searchable: true,
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-desktop is-6-tablet is-6-mobile',
                    },
                    agent_contract_id: {
                        type: 'VueSelect',
                        name: 'agent_contract_code',
                        unique: true,
                        props: {
                            source: route('administration.agentContracts.options'),
                            placeholder: 'Oberit # dohovoru',
                            label: 'contract_code',
                        },

                        label: '# dohovoru',
                        meta: {
                            searchable: true,
                            sortable: false,
                            replaceable: true,
                        },
                        class: 'is-2-fullh is-2-desktop is-2-tablet is-2-mobile',
                    },
                    agency_id: {
                        type: 'VueSelect',
                        name: 'agency_name',
                        props: {
                            source: route('administration.agencies.selectOptions'),
                            placeholder: 'Oberit agency',
                        },

                        label: 'Ahentsiyi',
                        meta: {
                            searchable: false,
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    commission_type_id: {
                        type: 'VueSelect',
                        name: 'commission_type_name',
                        refDisabled: 'agency_id',
                        props: {
                            source: route('references.commissiontypes.selectOptions'),
                            placeholder: 'Oberit typ komisiyi',
                        },

                        label: 'Typ komisiyi',
                        meta: {
                            searchable: true,
                            sortable: true,
                        },
                        class: 'is-2-fullhd is-2-desktop is-6-tablet is-6-mobile',
                    },
                    access_templates: {
                        type: 'VueSelect',
                        name: 'access_template_options',
                        refDisabled: 'commission_type_id',
                        props: {
                            source: route('administration.accessTemplates.options'),
                            placeholder: 'Oberit shablony dostupu',
                            multiple: true,
                        },

                        label: 'Shablony dostupu',
                        meta: {
                            searchable: true,
                            sortable: false,
                        },
                        class: 'is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
