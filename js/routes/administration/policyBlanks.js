import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./policyBlanks', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'policyBlanks',
    component: RouterView,
    meta: {
        breadcrumb: 'policyBlanks',
        route: 'administration.policyBlanks.index',
    },
    children: routes,
};
