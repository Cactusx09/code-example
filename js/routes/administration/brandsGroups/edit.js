const BrandsGroupEdit = () => import('@pages/administration/brandsGroups/Edit.vue');

export default {
    name: 'administration.brandsGroups.edit',
    path: ':brandsGroup/edit',
    component: BrandsGroupEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Редагувати групу брендів',
    },
};
