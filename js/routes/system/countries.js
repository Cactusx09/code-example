import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./countries', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'countries',
    component: RouterView,
    meta: {
        breadcrumb: 'countries',
        route: 'system.countries.index',
    },
    children: routes,
};
