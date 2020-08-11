import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./timelineMailingGroups', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: 'timelineMailingGroups',
    component: RouterView,
    meta: {
        breadcrumb: 'timelineMailingGroups',
        route: 'administration.timelineMailingGroups.index',
    },
    children: routes,
};
