const CarBrandCreate = () => import('@pages/administration/carBrands/Create.vue');

export default {
    name: 'administration.carBrands.create',
    path: 'create',
    component: CarBrandCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Створити бренд',
    },
};
