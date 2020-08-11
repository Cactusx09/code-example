import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./accessTemplates', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'accessTemplates',
    component: RouterView,
    meta: {
        breadcrumb: 'accessTemplate',
        route: 'administration.accessTemplates.index',
    },
    children: routes,
};
