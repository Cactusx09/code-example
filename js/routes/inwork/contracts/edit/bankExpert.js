const componentIndex = () => import('@pages/inwork/contracts/_tabs/BankExpert.vue');

export default {
    name: 'inwork.contracts.edit.bankExpert',
    path: 'bank-expert',
    component: componentIndex,
    meta: {
        breadcrumb: 'expert bank',
        title: 'expert bank',
    },
};
