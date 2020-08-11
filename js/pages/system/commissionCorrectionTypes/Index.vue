<template>

    <enso-table class="box"
               :path="path"
               id="commissionCorrectionType"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('system.commissionCorrectionTypes.initTable'),
            };
        },
    };

</script>
