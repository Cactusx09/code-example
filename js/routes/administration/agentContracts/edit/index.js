const componentIndex = () => import('@pages/administration/agentContracts/Edit.vue');

export default {
    name: 'administration.agentContracts.edit',
    path: 'edit',
    component: componentIndex,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Agents Contracts',
    },
}