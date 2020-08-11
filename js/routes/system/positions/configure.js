const PositionConfigure = () => import('@pages/system/positions/Configure.vue');

export default {
    name: 'system.positions.configure',
    path: ':position/configure',
    component: PositionConfigure,
    meta: {
        breadcrumb: 'configure',
        title: 'Configure Position',
    },
};
