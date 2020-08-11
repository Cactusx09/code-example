const ProlongationCreate = () => import('@pages/inwork/consultation/prolongation/Create.vue');

export default {
    name: 'inwork.consultations.prolongation.create',
    path: 'create',
    component: ProlongationCreate,
    props: true,
    meta: {
        breadcrumb: 'створити',
        title: 'Створити пролонгацію',
    },
};
