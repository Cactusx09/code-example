const printingFormsCreate = () => import('@pages/administration/printingForms/PrintingForms.vue');

export default {
    name: 'administration.printingForms.create',
    path: 'create',
    component: printingFormsCreate,
    meta: {
        breadcrumb: 'stvoriti',
        title: 'Stvoryty formy dlya druku',
    },
};
