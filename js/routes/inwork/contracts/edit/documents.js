const componentIndex = () => import('@pages/inwork/contracts/_tabs/Documents.vue');

export default {
    name: 'inwork.contracts.edit.documents',
    path: 'documents',
    component: componentIndex,
    meta: {
        breadcrumb: 'dokumenty',
        title: 'Dokumenty',
    },
};
