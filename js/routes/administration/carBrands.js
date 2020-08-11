import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./carBrands', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'carBrands',
    component: RouterView,
    meta: {
        breadcrumb: 'carBrands',
        route: 'administration.carBrands.index',
    },
    children: routes,
};
