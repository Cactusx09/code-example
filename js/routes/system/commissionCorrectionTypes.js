import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./commissionCorrectionTypes', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'commissionCorrectionTypes',
    component: RouterView,
    meta: {
        breadcrumb: 'typy koryguvannya komisij',
        route: 'system.commissionCorrectionTypes.index',
    },
    children: routes,
};
