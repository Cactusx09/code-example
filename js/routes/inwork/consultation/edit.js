const ConsultationEdit = () => import('@pages/inwork/consultation/Edit.vue');

export default {
    name: 'inwork.consultation.edit',
    path: ':consultation/edit',
    component: ConsultationEdit,
    props: true,
    meta: {
        breadcrumb: 'редагувати',
        title: 'Редагувати консультацію',
    },
};
