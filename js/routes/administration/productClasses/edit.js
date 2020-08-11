const ProductClassEdit = () => import('@pages/administration/productClasses/Edit.vue');

export default {
    name: 'administration.productClasses.edit',
    path: ':productClass/edit',
    component: ProductClassEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit product class',
    },
};
