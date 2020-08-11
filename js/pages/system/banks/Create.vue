<template>

    <div class="columns is-centered">
        <div class="column is-three-quarters">
            <enso-form class="box animated fadeIn"
                         :route-params="[$route.name, null, false]">
                <template slot="phone" slot-scope="{ field, errors }">
                    <label class="label">{{field.label}}</label>
                    <input-phone :field="field"
                                 v-model="field.value"
                                 :errors="errors"/>
                </template>
            </enso-form>
        </div>
    </div>

</template>

<script>

import { EnsoForm } from '@enso-ui/forms/bulma';
import InputPhone from '@components/vueforms/InputPhone.vue';

export default {
    components: { EnsoForm, InputPhone },

    inject: ['i18n'],
};

</script>
