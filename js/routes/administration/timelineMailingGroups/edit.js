const TimelineMailingGroupsEdit = () => import('@pages/administration/timelineMailingGroups/Edit.vue');

export default {
    name: 'administration.timelineMailingGroups.edit',
    path: ':timelineMailingGroup/edit',
    component: TimelineMailingGroupsEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit timelineMailingGroups',
    },
};
