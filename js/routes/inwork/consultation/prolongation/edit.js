const ProlongationEdit = () => import('@pages/inwork/consultation/prolongation/Edit.vue');

export default {
    name: 'inwork.consultations.prolongation.edit',
    path: ':consultation/edit',
    component: ProlongationEdit,
    props: true,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Prolongation',
    },
};
