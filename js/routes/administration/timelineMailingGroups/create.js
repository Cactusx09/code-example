const TimelineMailingGroupsCreate = () => import('@pages/administration/timelineMailingGroups/Create.vue');

export default {
    name: 'administration.timelineMailingGroups.create',
    path: 'create',
    component: TimelineMailingGroupsCreate,
    meta: {
        breadcrump: 'create',
        title: 'Create timelineMailingGroups',
    },
};
