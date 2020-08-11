const AgentsIndex = () => import('@pages/administration/agencies/Agents.vue');

export default {
    name: 'administration.agencies.agents.index',
    path: 'agents',
    component: AgentsIndex,
    meta: {
        breadcrumb: 'агенти',
        title: 'Агенти',
    },
};
