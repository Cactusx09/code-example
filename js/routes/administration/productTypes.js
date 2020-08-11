import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./productTypes', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'productTypes',
    component: RouterView,
    meta: {
        breadcrumb: 'productTypes',
        route: 'administration.productTypes.index',
    },
    children: routes,
};
