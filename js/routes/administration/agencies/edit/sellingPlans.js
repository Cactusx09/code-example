const sellingPlansIndex = () => import('@pages/administration/agencies/SellingPlans.vue');

export default {
    name: 'administration.agencies.sellingPlans.index',
    path: 'sellingplans',
    component: sellingPlansIndex,
    meta: {
        breadcrumb: 'плани продажу',
        title: 'Плани продажу',
    },
};
