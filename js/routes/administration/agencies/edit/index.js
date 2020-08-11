const componentIndex = () => import('@pages/administration/agencies/Edit.vue');

export default {
    name: 'administration.agencies.edit',
    path: 'edit',
    component: componentIndex,
    meta: {
        breadcrumb: 'редагування',
        title: 'Агенція',
    },
};
