const CommissionCorrectionTypeEdit = () => import('@pages/system/commissionCorrectionTypes/Edit.vue');

export default {
    name: 'system.commissionCorrectionTypes.edit',
    path: ':commissionCorrectionType/edit',
    component: CommissionCorrectionTypeEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Redahuvaty typ koryhuvannya komisiy',
    },
};
