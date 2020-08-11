<template>
    <div :class="['control', { 'has-icons-right': errors.has(field.name) }]">
        <input :class="['input', { 'is-danger': errors.has(field.name) }]"
            type="text"
            v-model="field.value"
            :readonly="field.meta.readonly"
            :disabled="isDisabled()"
            :placeholder="i18n(field.meta.placeholder)"
            @focus="focused = true; $emit('focused', focused)"
            @blur="focused = false; $emit('focused', focused)"
            @input="validatePhone(); $emit('input', field.value)" />
        <span class="icon is-small is-right has-text-danger"
            v-if="errors.has(field.name)">
            <fa icon="exclamation-triangle"/>
        </span>
    </div>
</template>

<script>

import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle }
    from '@fortawesome/free-solid-svg-icons';
import allow from '@core-middleware/before/allow';

library.add(faExclamationTriangle);
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
    inject: ['i18n'],
    props: {
        error_message: {
            type: String,
            default: 'Номер в невірному форматі',
        },
        field: {
            type: Object,
            required: true,
        },
        errors: {
            type: Object,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: null,
        },
    },

    data() {
        return {
            focused: false,
        };
    },

    methods: {
        isDisabled() {
            if (this.disabled) {
                return this.disabled;
            }
            return this.field.meta.disabled;
        },
        setError(result) {
            if (
                result
                && !_.isNull(this.field.value)
                && this.field.value !== ''
            ) {
                this.$set(this.errors.errors, this.field.name, {0: this.i18n(this.error_message)});
            } else {
                this.errors.clear(this.field.name);
            }
        },
        validatePhone() {
            try {
                let number = phoneUtil.parseAndKeepRawInput(this.field.value, 'UA');
                if (phoneUtil.isValidNumber(number)) {
                    this.field.value = phoneUtil.format(number, PNF.E164);
                    this.setError(false);
                } else {
                    this.setError(true);
                }
            } catch (e) {
                this.setError(true);
            }
        },
    },
}
</script>
