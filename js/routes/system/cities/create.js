const CityCreate = () => import('@pages/system/cities/Create.vue');

export default {
    name: 'system.cities.create',
    path: 'create',
    component: CityCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create City',
    },
};
