import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./test', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: '/test',
    component: RouterView,
    meta: {
        breadcrumb: 'в роботi',
    },
    children: routes,
};
