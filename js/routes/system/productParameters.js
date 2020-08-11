import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./productParameters', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'productParameters',
    component: RouterView,
    meta: {
        breadcrumb: 'productParameters',
        route: 'system.productParameters.index',
    },
    children: routes,
};
