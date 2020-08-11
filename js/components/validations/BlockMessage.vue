<template>
    <div>
        <slot :run-test="runTest"></slot>

        <modal
            :show="show"
            @close="show = false">
            <div class="block-message box">
                <div
                    v-if="blocking"
                    class="notification is-danger">
                    <div class="has-margin-bottom-medium">
                        <p class="title is-6">
                            {{ i18n('UVAHA! Tsya diya zablokovana strakhovoyu lohikoyu produkta.') }}
                        </p>
                    </div>
                    <span class="subtitle is-5">{{ i18n(message) }}</span>
                </div>

                <div
                    v-else
                    class="notification is-warning">
                    <div class="has-margin-bottom-medium">
                        <p class="title is-6">
                            <fa icon="exclamation-triangle"/>
                            {{ i18n('POPEREDZHENNIA!') }}
                        </p>
                    </div>
                    <span class="subtitle is-5">{{ i18n(message) }}</span>
                </div>

                <hr class="has-margin-bottom-medium has-margin-top-medium">

                <div class="level">
                    <div class="level-left">
                        <slot name="buttons" :set-show="setShow"></slot>
                    </div>

                    <div class="level-right">
                        <div class="level-item">
                            <button
                                class="button"
                                @click="show = false">
                                {{ i18n('Cancel') }}
                            </button>
                        </div>

                        <div class="level-item">
                            <button
                                v-if="!blocking"
                                ref="accessProcess"
                                class="button is-success"
                                @click="show = false">
                                {{ i18n('Prodovzhyty') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>

    import { Modal } from '@enso-ui/bulma'

    export default {
        components: { Modal },

        props: {
            blockingMsg: {
                type: Array,
                required: true,
            },
            warningMsg: {
                type: Array,
                required: true,
            },
        },

        inject: ['i18n'],

        data: () => ({
            show: false,
            blocking: false,
            message: null,
        }),

        methods: {
            runTest() {
                return new Promise((resolve, reject) => {
                    if (this.checkMessages(this.blockingMsg)) {
                        this.show = true;
                        this.blocking = true;
                    } else if (this.checkMessages(this.warningMsg)) {
                        this.show = true;
                        this.$nextTick(() => {
                            this.$refs.accessProcess.addEventListener('click', () => resolve());
                        });
                    } else {
                        resolve();
                    }
                });
            },
            checkMessages(messages) {
                const message = messages && messages.find(msg => msg && msg != '0');

                if (message) {
                    this.message = message;
                    return true;
                }
            },
            setShow(value) {
                this.show = value;
            },
        },
    };

</script>

<style lang="sass">
.block-message
    .notification
        margin-bottom: .5em
</style>
