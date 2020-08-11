const Edit = () => import('@pages/administration/insurancePrograms/Edit.vue');

export default {
    name: 'administration.insurancePrograms.edit',
    path: ':insuranceProgram/edit',
    component: Edit,
    meta: {
        breadcrumb: 'edit',
        title: 'Redahuvaty straxovu programy',
    },
};
