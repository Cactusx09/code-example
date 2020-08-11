const CalculationCommissionEdit = () => import('@pages/administration/calculationCommissions/Edit.vue');

export default {
    name: 'administration.calculationCommissions.edit',
    path: ':calculationCommission/edit',
    component: CalculationCommissionEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Редагувати комісію',
    },
};
