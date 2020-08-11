<template>

    <enso-table class="box"
               :path="path"
               id="positions"
               @configure-position="redirect"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('system.positions.initTable'),
            };
        },

        methods: {
            redirect($event) {
                this.$router.push({
                    name: 'system.positions.configure',
                    params: { position: $event.dtRowId },
                });
            },
        },
    };

</script>
