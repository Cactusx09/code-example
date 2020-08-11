const ConsultationCreate = () => import('@pages/inwork/consultation/Create.vue');

export default {
    name: 'inwork.consultation.create',
    path: 'create',
    component: ConsultationCreate,
    meta: {
        breadcrumb: 'створити',
        title: 'Створити консультацію',
    },
};
