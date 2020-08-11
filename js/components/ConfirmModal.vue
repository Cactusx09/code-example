<template>
    <modal
        :show="!!visible || visible === 0"
        @close="
            $emit('update:visible', false);
            $emit('cancel');
        "
        :i18n="i18n"
        v-on="$listeners">
        <slot>
            <div class="box">
                <slot name="header">
                    <h5 class="subtitle is-5">
                        {{ i18n(title) }}
                    </h5>
                </slot>
                <hr>
                <div class="level is-flex-mobile">
                    <div class="level-left">
                        <div class="level-item">
                            <button
                                @click="
                                    $emit('cancel');
                                    $emit('update:visible', false);
                                "
                                class="button is-outlined">
                                {{ i18n('Cancel') }}
                            </button>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <slot name="submit">
                                <button
                                    @click="
                                        $emit('submit');
                                        $emit('update:visible', false);
                                    "
                                    class="button is-danger has-margin-left-small">
                                    {{ i18n('Yes') }}
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </slot>
    </modal>
</template>

<script>
import { Modal } from '@enso-ui/modal/bulma'

export default {
    components: {
        Modal,
    },

    inject: ['i18n'],

    props: {
        title: {
            type: String,
        },
        visible: {
            default: true,
        },
    },

    created() {
        this.$emit('created');
    },
}

</script>
