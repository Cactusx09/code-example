<template>

    <div class="columns is-centered">
        <div class="column is-three-quarters">
            <enso-form class="box animated fadeIn"
                         :route-params="[$route.name, null, false]">
            </enso-form>
        </div>
    </div>

</template>

<script>

    import { EnsoForm } from '@enso-ui/forms/bulma';
    import { VueSelect } from '@enso-ui/select/bulma';

    export default {
        components: { EnsoForm, VueSelect },
    };

</script>
