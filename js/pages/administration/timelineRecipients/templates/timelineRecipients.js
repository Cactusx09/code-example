export default {
    data() {
        return {
            timelineRecipientsTemplate: {
                isMultipleSelectConvertStructure: true,
                rowToAdd: true,
                columns: {
                    timeline_activity_entity_id: {
                        type: 'VueSelect',
                        name: 'timeline_activity_entity_name',
                        props: {
                            source: route('references.timelineActivityEntities.selectOptions'),
                            placeholder: 'Oberit sutnist',
                        },

                        label: 'Sutnist',
                        meta: {
                            searchable: true,
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'user_name is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-6-mobile',
                    },
                    timeline_activity_event_type_id: {
                        type: 'VueSelect',
                        name: 'timeline_activity_event_type_name',
                        refDisabled: 'timeline_activity_entity_id',
                        props: {
                            source: route('references.timelineActivityEventTypes.selectOptions'),
                            placeholder: 'Oberit typ podii',
                        },

                        label: 'Typ podii',
                        meta: {
                            searchable: true,
                            sortable: true,
                            replaceable: true,
                        },
                        class: 'user_name is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                    timeline_activity_user_presets: {
                        name: 'timeline_activity_user_presets_multiple',
                        type: 'VueSelect',
                        refDisabled: 'timeline_activity_event_type_id',
                        props: {
                            source: route('references.timelineActivityUserPresets.selectOptions'),
                            placeholder: 'Oberit komu',
                            multiple: true,
                        },

                        label: 'Dozvolyty',
                        meta: {
                            searchable: true,
                        },
                        class: 'is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-6-mobile',
                    },
                },
            },
        };
    },
};
