const ContractsEdit = () => import('@pages/inwork/contracts/Edit.vue');

import routeImporter from '@core-modules/importers/routeImporter';
const routes = routeImporter(require.context('./edit', false, /.*\.js$/));

export default {
    name: 'inwork.contracts.edit',
    path: ':contract/edit',
    component: ContractsEdit,
    props: true,
    meta: {
        breadcrumb: 'redaguvati',
    },
    children: routes,
};
