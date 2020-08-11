import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./banks', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'banks',
    component: RouterView,
    meta: {
        breadcrumb: 'banks',
        route: 'system.banks.index',
    },
    children: routes,
};
