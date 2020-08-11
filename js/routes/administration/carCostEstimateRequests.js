import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./carCostEstimateRequests', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'carCostEstimateRequests',
    component: RouterView,
    meta: {
        breadcrumb: 'ekspertni ocinky vartosti',
        route: 'administration.carCostEstimateRequests.index',
    },
    children: routes,
};
