const componentIndex = () => import('@pages/inwork/contracts/_tabs/CreditAgreement.vue');

export default {
    name: 'inwork.contracts.edit.creditAgreement',
    path: 'credit-agreement',
    component: componentIndex,
    meta: {
        breadcrumb: 'kredytna uhoda',
        title: 'Kredytna uhoda',
    },
};
