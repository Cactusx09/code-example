import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./insuranceLogics', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'insuranceLogics',
    component: RouterView,
    meta: {
        breadcrumb: 'strahovi logiki',
        title: 'Strahovi logiki',
        route: 'administration.insuranceLogics.index',
    },
    children: routes,
};
