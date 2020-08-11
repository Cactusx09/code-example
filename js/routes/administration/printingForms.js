import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./printingForms', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'printingForms',
    component: RouterView,
    meta: {
        breadcrumb: 'formy dlya druku',
        title: 'Formy dlya druku',
        route: 'administration.printingForms.index',
    },
    children: routes,
};
