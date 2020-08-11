const ProductParameterCreate = () => import('@pages/system/productParameters/Create.vue');

export default {
    name: 'system.productParameters.create',
    path: 'create',
    component: ProductParameterCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Product Parameter',
    },
};
