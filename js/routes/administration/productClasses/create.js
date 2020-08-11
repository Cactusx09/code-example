const ProductClassCreate = () => import('@pages/administration/productClasses/Create.vue');

export default {
    name: 'administration.productClasses.create',
    path: 'create',
    component: ProductClassCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create product class',
    },
};
