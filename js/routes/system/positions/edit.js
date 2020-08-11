const PositionEdit = () => import('@pages/system/positions/Edit.vue');

export default {
    name: 'system.positions.edit',
    path: ':position/edit',
    component: PositionEdit,
    meta: {
        breadcrumb: 'edit',
        title: 'Edit Position',
    },
};
