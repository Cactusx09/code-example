import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./productParameterGroups', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'productParameterGroups',
    component: RouterView,
    meta: {
        breadcrumb: 'productParameterGroups',
        route: 'system.productParameterGroups.index',
    },
    children: routes,
};
