const Create = () => import('@pages/Test.vue');

export default {
    name: 'test.create',
    path: '/test/create',
    component: Create,
    meta: {
        breadcrumb: 'test create',
        title: 'Тест create',
    },
};
