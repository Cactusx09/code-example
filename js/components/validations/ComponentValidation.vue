<template>
    <div>
        <div class="columns level has-margin-bottom-large">
            <div class="column level-left custom">
                <h3 v-if="label"
                    :class="labelClass">
                    {{ i18n(label) }}
                </h3>
                <span v-if="errors.has(name)"
                    class="custom__notification">
                    <error-icon class="has-margin-left-large"/>
                    <p class="help is-danger has-margin-left-large">
                        {{ errors.get(name) }}
                    </p>
                </span>
            </div>
            <slot name="title-right"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faInfoCircle);

import ErrorIcon from '@enso-ui/forms/src/bulma/parts/ErrorIcon'

export default {
    components: {
        ErrorIcon,
    },

    inject: ['i18n'],

    props: {
        label: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        errors: {
            type: Object,
        },
        labelClass: {
            type: String,
            default: 'title is-5',
        }
    },
}
</script>

<style lang="sass">
.custom
    display: flex
    align-items: flex-start
    &__notification
        display: flex
        align-items: center
</style>

