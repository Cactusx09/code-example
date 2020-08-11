import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./consultation', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'consultation',
    component: RouterView,
    meta: {
        breadcrumb: 'консультації',
        route: 'inwork.main.index',
    },
    children: routes,
};
