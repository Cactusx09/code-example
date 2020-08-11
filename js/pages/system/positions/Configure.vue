<template>
    <div class="columns is-centered">
        <div class="column is-half is-three-fifths-desktop is-full-touch">
            <div class="animated fadeIn"
                v-if="data">
                <checkbox-manager class="is-rounded has-margin-top-large"
                    :title="`${data.position.display_name}'s ${i18n('Permissions')}`"
                    :role-permissions="data.positionPermissions"
                    :data="data.permissions"/>
                <button class="button is-success has-margin-top-large is-pulled-right"
                    @click="update"
                    :disabled="!canAccess('system.positions.setPermissions')">
                    {{ i18n("Update") }}
                </button>
                <div class="is-clearfix"/>
            </div>
        </div>
    </div>
</template>

<script>
import CheckboxManager from '@core-pages/system/roles/components/CheckboxManager.vue';

import errorHandler from '@components/mixins/errorHandler'

export default {
    name: 'Configure',

    inject: ['canAccess', 'i18n'],

    mixins: [errorHandler],

    components: { CheckboxManager },

    data() {
        return {
            data: null,
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(route('system.positions.getPermissions', this.$route.params.position))
                .then(({ data }) => (this.data = data))
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        update() {
            axios.post(
                    route('system.positions.setPermissions', this.$route.params.position),
                    { rolePermissions: this.data.positionPermissions },
                )
                .then(({ data }) => this.$toastr.success(data.message))
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>
