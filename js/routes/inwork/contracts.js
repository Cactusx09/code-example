import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./contracts', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'contracts',
    component: RouterView,
    meta: {
        breadcrumb: 'договір',
        route: 'contractsTable.index',
        title: 'договір',
    },
    children: routes,
};
