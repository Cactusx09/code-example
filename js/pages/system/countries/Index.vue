<template>

    <enso-table
            class="box"
            :path="path"
            id="countries"
            :table-responsiveness="false"/>

</template>

<script>

import { EnsoTable } from '@enso-ui/tables/bulma';

export default {
    components: { EnsoTable },

    data() {
        return {
            path: route('system.countries.initTable'),
        };
    },
};

</script>
