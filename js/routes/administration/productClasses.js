import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./productClasses', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'productClasses',
    component: RouterView,
    meta: {
        breadcrumb: 'productClasses',
        route: 'administration.productClasses.index',
    },
    children: routes,
};
