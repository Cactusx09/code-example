const printingFormsCreate = () => import('@pages/administration/printingForms/PrintingForms.vue');

export default {
    name: 'administration.printingForms.edit',
    path: ':printingForm/edit',
    component: printingFormsCreate,
    meta: {
        breadcrumb: 'redaguvati',
        title: 'Redaguvati formy dlya druku',
    },
};
