const UserSigns = () => import('@pages/administration/users/Signs.vue');

export default {
    name: 'administration.users.edit.signs',
    path: ':user/signs',
    component: UserSigns,
    meta: {
        breadcrumb: 'pidpysanty`',
        title: 'Pidpysanty`',
    },
};
