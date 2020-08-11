const HomeIndex = () => import('@pages/home/Index.vue');

export default {
    name: 'home.index',
    path: '/home',
    component: HomeIndex,
    meta: {
        breadcrumb: 'home',
        title: 'Домашня',
    },
};
