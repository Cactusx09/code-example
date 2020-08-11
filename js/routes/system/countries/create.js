const CountryCreate = () => import('@pages/system/countries/Create.vue');

export default {
    name: 'system.countries.create',
    path: 'create',
    component: CountryCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Country',
    },
};
