import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./calculationCommissions', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'calculationCommissions',
    component: RouterView,
    meta: {
        breadcrumb: 'calculationCommissions',
        route: 'administration.calculationCommissions.index',
    },
    children: routes,
};
