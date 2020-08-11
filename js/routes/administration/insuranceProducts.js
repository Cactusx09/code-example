import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./insuranceProducts', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'insuranceProducts',
    component: RouterView,
    meta: {
        breadcrumb: 'strahovi produkti',
        title: 'Strahovi produkti',
        route: 'administration.insuranceProducts.index',
    },
    children: routes,
};
