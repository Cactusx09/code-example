const CreditRequestsTableIndex = () => import('@pages/creditRequestsTable/Index.vue');

export default {
    name: 'creditRequestsTable.index',
    path: '/creditRequestsTable',
    component: CreditRequestsTableIndex,
    meta: {
        breadcrumb: 'кредитні заявки',
        title: 'Кредитні заявки',
    },
};
