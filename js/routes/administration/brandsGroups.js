import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./brandsGroups', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'brandsGroups',
    component: RouterView,
    meta: {
        breadcrumb: 'brandsGroups',
        route: 'administration.brandsGroups.index',
    },
    children: routes,
};
