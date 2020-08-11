<template>

    <enso-table class="box is-paddingless raises-on-hover"
        :path="path"
        id="productTypes"/>

</template>

<script>
import { EnsoTable } from '@enso-ui/tables/bulma';

export default {
    components: {
        EnsoTable,
    },
    inject: ['i18n'],
    data() {
        return {
            path: route('administration.insuranceLogics.initTable'),
        }
    },
}
</script>
