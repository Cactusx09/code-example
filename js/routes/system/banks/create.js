const BankCreate = () => import('@pages/system/banks/Create.vue');

export default {
    name: 'system.banks.create',
    path: 'create',
    component: BankCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Створити банк',
    },
};
