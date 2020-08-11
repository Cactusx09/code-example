<template>

    <enso-table
            class="box"
            :path="path"
            id="productParameters"
            :table-responsiveness="false"/>

</template>

<script>

import { EnsoTable } from '@enso-ui/tables/bulma';

export default {
    components: { EnsoTable },

    data() {
        return {
            path: route('system.productParameters.initTable'),
        };
    },
};

</script>
