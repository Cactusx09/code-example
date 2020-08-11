import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./insurancePrograms', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'insurancePrograms',
    component: RouterView,
    meta: {
        breadcrumb: 'straxovi programy',
        route: 'administration.insurancePrograms.index',
    },
    children: routes,
};
