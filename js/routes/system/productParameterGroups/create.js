const ProductParameterGroupCreate = () => import('@pages/system/productParameterGroups/Create.vue');

export default {
    name: 'system.productParameterGroups.create',
    path: 'create',
    component: ProductParameterGroupCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Product Parameter Group',
    },
};
