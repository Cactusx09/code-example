const ProductParameterGroupEdit = () => import('@pages/system/productParameterGroups/Edit.vue');

export default {
    name: 'system.productParameterGroups.edit',
    path: ':productParameterGroup/edit',
    component: ProductParameterGroupEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Product Parameter Group',
    },
};
