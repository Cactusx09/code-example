import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./inwork', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: '/inwork',
    component: RouterView,
    meta: {
        breadcrumb: 'в роботi',
    },
    children: routes,
};
