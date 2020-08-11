import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./edit', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: ':agentContract',
    component: RouterView,
    meta: {
        breadcrumb: 'agents contracts',
        title: 'Edit Agents Contracts',
        route: 'administration.agentContracts.edit',
    },
    children: routes,
};
