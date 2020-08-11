const RegionEdit = () => import('@pages/system/regions/Edit.vue');

export default {
    name: 'system.regions.edit',
    path: ':region/edit',
    component: RegionEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Region',
    },
};
