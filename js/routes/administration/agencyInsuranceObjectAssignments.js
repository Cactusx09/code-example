import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./agencyInsuranceObjectAssignments', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'agencyInsuranceObjectAssignments',
    component: RouterView,
    meta: {
        breadcrumb: 'Agenciyi do obyektiv straxuvannya',
        route: 'administration.agencyInsuranceObjectAssignments.index',
    },
    children: routes,
};
