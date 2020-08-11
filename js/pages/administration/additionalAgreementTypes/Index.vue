<template>

    <enso-table class="box is-paddingless raises-on-hover"
               :path="path"
               id="additionalAgreementTypes"/>

</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';

    export default {
        components: { EnsoTable },

        data() {
            return {
                path: route('administration.additionalAgreementTypes.initTable'),
            };
        },
    };

</script>
