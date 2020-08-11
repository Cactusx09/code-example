import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./agencies', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'agencies',
    component: RouterView,
    meta: {
        breadcrumb: 'ahentsiyi',
        route: 'administration.agencies.index',
    },
    children: routes,
};
