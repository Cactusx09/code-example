<template>

    <enso-table class="box is-paddingless raises-on-hover"
               :path="path"
               id="banks"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('system.banks.initTable'),
            };
        },
    };

</script>
