const ContractsTableIndex = () => import('@pages/contractsTable/Index.vue');

export default {
    name: 'contractsTable.index',
    path: '/contractsTable',
    component: ContractsTableIndex,
    meta: {
        breadcrumb: 'договори',
        title: 'Договори',
    },
};
