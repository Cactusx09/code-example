import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./carModels', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'carModels',
    component: RouterView,
    meta: {
        breadcrumb: 'carModels',
        route: 'administration.carModels.index',
    },
    children: routes,
};
