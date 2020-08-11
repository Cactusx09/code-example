import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./bankAccounts', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'bankAccounts',
    component: RouterView,
    meta: {
        breadcrumb: 'Bank_Accounts',
        route: 'system.bankAccounts.index',
    },
    children: routes,
};
