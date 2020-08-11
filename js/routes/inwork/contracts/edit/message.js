const componentIndex = () => import('@pages/inwork/contracts/_tabs/Messages.vue');

export default {
    name: 'inwork.contracts.edit.messages',
    path: 'messages',
    component: componentIndex,
    meta: {
        breadcrumb: 'povidomlennya',
        title: 'Povidomlennya'
    },
};
