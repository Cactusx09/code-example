const Edit = () => import('@pages/Test.vue');

export default {
    name: 'test.edit',
    path: ':consultation/edit',
    component: Edit,
    props: true,
    meta: {
        breadcrumb: 'test edit',
        title: 'Тест edit',
    },
};
