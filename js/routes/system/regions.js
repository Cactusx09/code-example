import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./regions', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'regions',
    component: RouterView,
    meta: {
        breadcrumb: 'regions',
        route: 'system.regions.index',
    },
    children: routes,
};
