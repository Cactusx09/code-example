<template>

    <div class="columns is-centered">
        <div class="column is-three-quarters">
            <enso-form class="box animated fadeIn"
                         :route-params="[$route.name, null, false]">
                <template slot="country_id" slot-scope="{ field, errors }">
                    <vue-select v-model="field.value"
                                :has-error="errors.has(field.name)"
                                @input="errors.clear(field.name);pivotParams.country.id=$event;"
                                :source="field.meta.source"/>
                </template>
                <template slot="region_id" slot-scope="{ field, errors }">
                    <vue-select v-model="field.value"
                                :pivot-params="pivotParams"
                                :has-error="errors.has(field.name)"
                                @input="errors.clear(field.name);"
                                :source="field.meta.source"/>
                </template>
            </enso-form>
        </div>
    </div>

</template>

<script>

    import { EnsoForm } from '@enso-ui/forms/bulma';
    import { VueSelect } from '@enso-ui/select/bulma';

    export default {
        components: { EnsoForm, VueSelect },

        data() {
            return {
                pivotParams: {
                    country: { id: null }
                },
            };
        },
    };

</script>
