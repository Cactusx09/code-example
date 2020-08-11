import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./timelineRecipients', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');


export default {
    path: 'timelineRecipients',
    component: RouterView,
    meta: {
        breadcrumb: 'Administruvannya povidomlen',
        route: 'administration.timelineRecipients.index',
    },
    children: routes,
};
