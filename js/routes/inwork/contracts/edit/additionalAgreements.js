const componentIndex = () => import('@pages/inwork/contracts/_tabs/AdditionalAgreements.vue');

export default {
    name: 'inwork.contracts.edit.additionalAgreements',
    path: 'additional-agreements',
    component: componentIndex,
    meta: {
        breadcrumb: 'additional agreements',
        title: 'additional agreements',
    },
};
