const printingFormsCreate = () => import('@pages/administration/printingForms/Index.vue');

export default {
    name: 'administration.printingForms.index',
    path: '',
    component: printingFormsCreate,
    meta: {
        breadcrumb: 'index',
        title: 'Formy dlya druku',
    },
};
