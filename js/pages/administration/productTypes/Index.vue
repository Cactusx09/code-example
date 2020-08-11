<template>

    <enso-table class="box is-paddingless raises-on-hover"
        :path="path"
        id="productTypes" />

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('administration.productTypes.initTable'),
            };
        },
    };

</script>
