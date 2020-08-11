const commissionsIndex = () => import('@pages/administration/agencies/Commissions.vue');

export default {
    name: 'administration.agencies.commissions.index',
    path: 'commissions',
    component: commissionsIndex,
    meta: {
        breadcrumb: 'комісії',
        title: 'Комісії',
    },
};
