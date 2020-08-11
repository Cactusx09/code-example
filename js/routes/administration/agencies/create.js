const AgencyCreate = () => import('@pages/administration/agencies/Create.vue');

export default {
    name: 'administration.agencies.create',
    path: 'create',
    component: AgencyCreate,
    meta: {
        breadcrumb: 'stvoryty',
        title: 'Stvoryty ahentsiyu',
    },
};
