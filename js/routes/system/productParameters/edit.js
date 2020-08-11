const ProductParameterEdit = () => import('@pages/system/productParameters/Edit.vue');

export default {
    name: 'system.productParameters.edit',
    path: ':productParameter/edit',
    component: ProductParameterEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Product Parameter',
    },
};
