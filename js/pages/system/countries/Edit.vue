<template>

    <div class="columns is-centered">
        <div class="column is-three-quarters">
            <enso-form class="box animated fadeIn"
                         :route-params="[$route.name, $route.params.id, false]"/>
        </div>
    </div>

</template>

<script>

    import { EnsoForm } from '@enso-ui/forms/bulma';

    export default {
        components: { EnsoForm },
    };

</script>
