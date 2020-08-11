const CarBrandEdit = () => import('@pages/administration/carBrands/Edit.vue');

export default {
    name: 'administration.carBrands.edit',
    path: ':carBrand/edit',
    component: CarBrandEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Редагувати бренд',
    },
};
