const CountryEdit = () => import('@pages/system/countries/Edit.vue');

export default {
    name: 'system.countries.edit',
    path: ':country/edit',
    component: CountryEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Country',
    },
};
