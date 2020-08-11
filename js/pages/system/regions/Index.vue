<template>

    <enso-table class="box"
               :path="path"
               id="regions"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('system.regions.initTable'),
            };
        },
    };

</script>
