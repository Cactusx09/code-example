<template>

    <enso-table class="box is-paddingless raises-on-hover"
        :path="route('administration.brandsGroups.initTable')"
        id="brandsGroups"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma'

    export default {
        components: { EnsoTable },
    };

</script>
