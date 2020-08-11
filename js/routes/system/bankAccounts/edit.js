const BankAccountEdit = () => import('@pages/system/bankAccounts/Edit.vue');

export default {
    name: 'system.bankAccounts.edit',
    path: ':bankAccount/edit',
    component: BankAccountEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit_Bank_Account',
    },
};
