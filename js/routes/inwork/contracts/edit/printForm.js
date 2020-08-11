const componentIndex = () => import('@pages/inwork/contracts/_tabs/PrintForm.vue');

export default {
    name: 'inwork.contracts.edit.printForm',
    path: 'print-form',
    component: componentIndex,
    props: true,
    meta: {
        breadcrumb: 'forma dlya druku',
        title: 'Forma dlya druku'
    },
};
