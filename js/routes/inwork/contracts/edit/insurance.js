const componentIndex = () => import('@pages/inwork/contracts/_tabs/Insurance.vue');

export default {
    name: 'inwork.contracts.edit.insurance',
    path: 'insurance',
    component: componentIndex,
    meta: {
        breadcrumb: 'strakhuvannia',
        title: 'Strakhuvannia',
    },
};
