<template>

    <div class="columns is-centered">
        <div class="column is-three-quarters">
            <enso-form class="box animated fadeIn"
                :route-params="[$route.name, $route.params.id, false]"
                ref="form"
                @loaded="pivotParams.country.id=$refs.form.field('country_id').value">
                <template slot="country_id" slot-scope="props">
                    <form-field
                          v-bind="props"
                          @input="pivotParams.country.id = $event;"
                    />
                </template>
                <template slot="region_id" slot-scope="props">
                    <form-field
                          v-bind="props"
                          :pivot-params="pivotParams"
                    />
                </template>
            </enso-form>
        </div>
    </div>

</template>

<script>

    import { EnsoForm, FormField } from '@enso-ui/forms/bulma';
    import { VueSelect } from '@enso-ui/select/bulma';

    export default {
        components: { EnsoForm, VueSelect, FormField },

        data() {
            return {
                pivotParams: {
                    country: { id: null }
                },
            };
        },
    };

</script>
