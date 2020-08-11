const ContractsCreate = () => import('@pages/inwork/contracts/Create.vue');

export default {
    name: 'inwork.contracts.create',
    path: 'create',
    component: ContractsCreate,
    props: true,
    meta: {
        breadcrumb: 'stvoryty',
        title: 'Stvoryty dogovir',
    },
};
