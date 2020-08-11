import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./positions', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'positions',
    component: RouterView,
    meta: {
        breadcrumb: 'positions',
        route: 'system.positions.index',
    },
    children: routes,
};
