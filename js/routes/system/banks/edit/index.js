const BankEdit = () => import('@pages/system/banks/Edit.vue');

export default {
    name: 'system.banks.edit',
    path: 'edit',
    component: BankEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Редагувати банк',
    },
};
