const CalculationCommissionCreate = () => import('@pages/administration/calculationCommissions/Create.vue');

export default {
    name: 'administration.calculationCommissions.create',
    path: 'create',
    component: CalculationCommissionCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Створити комісію',
    },
};
