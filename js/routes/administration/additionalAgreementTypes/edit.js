const Edit = () => import('@pages/administration/additionalAgreementTypes/Edit.vue');

export default {
    name: 'administration.additionalAgreementTypes.edit',
    path: ':additionalAgreementType/edit',
    component: Edit,
    meta: {
        breadcrumb: 'edit',
        title: 'Redaguvaty typ dodatkovoyi ugody',
    },
};
