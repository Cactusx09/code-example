const ProductCreate = () => import('@pages/administration/insuranceProducts/Create.vue');

export default {
    name: 'administration.insuranceProducts.create',
    path: 'create',
    component: ProductCreate,
    props: true,
    meta: {
        breadcrumb: 'stvoriti',
        title: 'Stvoriti strahovij produkt',
    },
};
