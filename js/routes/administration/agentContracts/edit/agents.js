const AgentsIndex = () => import('@pages/administration/agentContracts/Agents.vue');

export default {
    name: 'administration.agentContracts.agents.index',
    path: 'agents',
    component: AgentsIndex,
    meta: {
        breadcrumb: 'агенти',
        title: 'Агенти',
    },
};
