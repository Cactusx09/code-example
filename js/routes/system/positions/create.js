const PositionCreate = () => import('@pages/system/positions/Create.vue');

export default {
    name: 'system.positions.create',
    path: 'create',
    component: PositionCreate,
    meta: {
        breadcrumb: 'create',
        title: 'Create Position',
    },
};
