import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./additionalAgreementTypes', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'additionalAgreementTypes',
    component: RouterView,
    meta: {
        breadcrumb: 'dodatkovi ugody',
        route: 'administration.additionalAgreementTypes.index',
    },
    children: routes,
};
