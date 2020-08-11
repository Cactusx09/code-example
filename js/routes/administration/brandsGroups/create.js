const BrandsGroupsCreate = () => import('@pages/administration/brandsGroups/Create.vue');

export default {
    name: 'administration.brandsGroups.create',
    path: 'create',
    component: BrandsGroupsCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Створити групу брендів',
    },
};
