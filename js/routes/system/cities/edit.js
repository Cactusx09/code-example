const CityEdit = () => import('@pages/system/cities/Edit.vue');

export default {
    name: 'system.cities.edit',
    path: ':city/edit',
    component: CityEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit City',
    },
};
