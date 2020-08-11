const AccessTemplateCreate = () => import('@pages/administration/accessTemplates/Create.vue');

export default {
    name: 'administration.accessTemplates.create',
    path: 'create',
    component: AccessTemplateCreate,
    meta: {
        breadcrumb: 'stvoryty',
        title: 'Stvoryty access template',
    },
};
