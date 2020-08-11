const ProductEdit = () => import('@pages/administration/insuranceProducts/Edit.vue');

export default {
    name: 'administration.insuranceProducts.edit',
    path: ':insuranceProduct/edit',
    component: ProductEdit,
    props: true,
    meta: {
        breadcrumb: 'redaguvati',
        title: 'Redaguvati strahovij produkt',
    },
};
