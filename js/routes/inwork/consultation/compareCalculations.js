const ContractsPrint = () => import('@pages/inwork/contracts/_tabs/CompareCalculations.vue');

export default {
    name: 'inwork.consultation.compareCalculations',
    path: 'CompareCalculations',
    component: ContractsPrint,
    props: true,
    meta: {
        breadcrumb: '“порівняння продуктів” КАСКО',
        title: '“Порівняння продуктів” КАСКО',
    },
};