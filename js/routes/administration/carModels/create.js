const CarModelCreate = () => import('@pages/administration/carModels/Create.vue');

export default {
    name: 'administration.carModels.create',
    path: 'create',
    component: CarModelCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Створити модель',
    },
};
