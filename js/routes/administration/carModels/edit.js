const CarModelEdit = () => import('@pages/administration/carModels/Edit.vue');

export default {
    name: 'administration.carModels.edit',
    path: ':carModel/edit',
    component: CarModelEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Редагувати модель',
    },
};
