import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./edit', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: ':bank',
    component: RouterView,
    meta: {
        breadcrumb: 'банк',
        title: 'Банк',
        route: 'system.banks.edit',
    },
    children: routes,
};