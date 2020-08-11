const RegionCreate = () => import('@pages/system/regions/Create.vue');

export default {
    name: 'system.regions.create',
    path: 'create',
    component: RegionCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Region',
    },
};
