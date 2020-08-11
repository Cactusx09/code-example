const insuranceLogicsEdit = () => import('@pages/administration/insuranceLogics/Edit.vue');

export default {
    name: 'administration.insuranceLogics.edit',
    path: ':insuranceLogic/edit',
    component: insuranceLogicsEdit,
    meta: {
        breadcrumb: 'redaguvati',
        title: 'Redaguvati strahovu logiku',
    },
};
