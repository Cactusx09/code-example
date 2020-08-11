<template>

    <enso-table class="box"
               :path="path"
               id="cities"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('system.cities.initTable'),
            };
        },
    };

</script>
