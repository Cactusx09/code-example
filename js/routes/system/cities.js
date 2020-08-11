import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./cities', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'cities',
    component: RouterView,
    meta: {
        breadcrumb: 'cities',
        route: 'system.cities.index',
    },
    children: routes,
};
