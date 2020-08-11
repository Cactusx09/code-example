<template>
    <div>
        <slot name="label">
            <label v-if="label" class="label">{{ i18n(label) }}</label>
        </slot>
        <div :class="['control', { 'has-icons-right': errors.has(name) }]">
            <slot>
                <input :class="['input', { 'is-danger': errors.has(name) }]"
                    :value="value"
                    type="text"
                    :placeholder="i18n(placeholder)"
                    @input="$emit('input', $event.target.value); errors.clear(name);">
            </slot>
            <error-icon v-if="errors.has(name)"/>
        </div>
        <p class="help is-danger"
            v-if="errors.has(name)">
            {{ errors.get(name) }}
        </p>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faInfoCircle);

import ErrorIcon from '@enso-ui/forms/src/bulma/parts/ErrorIcon.vue';

export default {
    components: {
        ErrorIcon
    },

    inject: ['i18n'],

    props: {
        name: {
            type: String,
            required: true,
        },
        label: {
            type: String,
        },
        value: {
            type: String,
        },
        placeholder: {
            type: String,
        },
        errors: {
            type: Object,
        }
    },
}
</script>
