const BankAccountCreate = () => import('@pages/system/bankAccounts/Create.vue');

export default {
    name: 'system.bankAccounts.create',
    path: 'create',
    component: BankAccountCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create_Bank_Account',
    },
};
