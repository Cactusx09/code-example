const AgentContractCreate = () => import('@pages/administration/agentContracts/Create.vue');

export default {
    name: 'administration.agentContracts.create',
    path: 'create',
    component: AgentContractCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Agents Contracts',
    },
};
