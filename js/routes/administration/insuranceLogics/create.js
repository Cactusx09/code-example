const insuranceLogicsCreate = () => import('@pages/administration/insuranceLogics/Create.vue');

export default {
    name: 'administration.insuranceLogics.create',
    path: 'create',
    component: insuranceLogicsCreate,
    meta: {
        breadcrumb: 'stvoriti',
        title: 'Stvoriti strahovu logiku',
    },
};
