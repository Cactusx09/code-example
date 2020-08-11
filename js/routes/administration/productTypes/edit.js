const ProductTypeEdit = () => import('@pages/administration/productTypes/Edit.vue');

export default {
    name: 'administration.productTypes.edit',
    path: ':productType/edit',
    component: ProductTypeEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit product type',
    },
};
