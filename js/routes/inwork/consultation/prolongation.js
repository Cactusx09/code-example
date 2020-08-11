import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./prolongation', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'prolongation',
    component: RouterView,
    meta: {
        breadcrumb: 'пролонгация',
        route: 'inwork.main.index',
    },
    children: routes,
};
