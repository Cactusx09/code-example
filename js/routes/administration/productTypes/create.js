const ProductTypeCreate = () => import('@pages/administration/productTypes/Create.vue');

export default {
    name: 'administration.productTypes.create',
    path: 'create',
    component: ProductTypeCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create product type',
    },
};
