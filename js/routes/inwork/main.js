import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./main', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'main',
    component: RouterView,
    meta: {
        breadcrumb: 'консультації',
        route: 'inwork.main.index',
    },
    children: routes,
};
