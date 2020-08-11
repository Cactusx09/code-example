import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./agentContracts', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'agentContracts',
    component: RouterView,
    meta: {
        breadcrumb: 'agent contracts',
        route: 'administration.agentContracts.index',
    },
    children: routes,
};
