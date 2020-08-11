const AccessTemplateEdit = () => import('@pages/administration/accessTemplates/Edit.vue');

export default {
    name: 'administration.accessTemplates.edit',
    path: ':accessTemplate/edit',
    component: AccessTemplateEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Access Template',
    },
};
