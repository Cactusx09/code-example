import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./edit', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: ':agency',
    component: RouterView,
    meta: {
        breadcrumb: 'ahentsiya',
        title: 'redahuvaty ahentsiyu',
        route: 'administration.agencies.edit',
    },
    children: routes,
};
