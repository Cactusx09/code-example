import routeImporter from '@core-modules/importers/routeImporter';

const routes = routeImporter(require.context('./myAgencies', false, /.*\.js$/));
const RouterView = () => import('@core-pages/Router.vue');

export default {
    path: '/myAgencies',
    component: RouterView,
    meta: {
        breadcrumb: 'moyi ahentsiyi',
    },
    children: routes,
};
