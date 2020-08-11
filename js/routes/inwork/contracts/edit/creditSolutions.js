const componentIndex = () => import('@pages/inwork/contracts/_tabs/CreditSolutions.vue');

export default {
    name: 'inwork.contracts.edit.creditSolutions',
    path: 'credit-solutions',
    component: componentIndex,
    meta: {
        breadcrumb: 'kredytnyy dohovir',
        title: 'Kredytnyy dohovir',
    },
};
