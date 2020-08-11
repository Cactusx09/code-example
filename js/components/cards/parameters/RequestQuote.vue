<template>
    <modal-card
        show
        class="modal__full request-quote"
        @close="$emit('close')">
        <template #header>
            <div class="title is-5">
                {{ i18n('Zapyt na kotuvannya') }}
            </div>
        </template>

        <template #body>
            <enso-form
                :path="route('inwork.consultation.requestQuote.edit', stateId.id)"
                ref="requestQuote"
                @ready="ready()"
            />

            <consultation-request-quote
                v-if="showConsultationRequestQuote"
                :state-id="stateId"
                @save="$nextTick(() => $refs.requestQuote.fetch())"
                @close="showConsultationRequestQuote = false"
            />
        </template>

        <template #footer>
            <div class="level request-quote-buttons">
                <div class="level-left">
                    <button
                        v-if="canAccess('inwork.consultation.requestQuote.giveAnswer')"
                        class="button is-link"
                        @click="showConsultationRequestQuote = true">
                        <span class="is-hidden-mobile">{{ i18n('Kotyruvaty') }}</span>
                    </button>
                </div>

                <div class="level-right">
                    <button
                        class="button button-back is-primary"
                        @click="$emit('close')">
                        <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                        <fa icon="arrow-left" class="has-margin-left-medium"/>
                    </button>

                    <button
                        class="button is-success"
                        @click="updateRequestQuote()">
                        <span class="is-hidden-mobile">{{ i18n('Update') }}</span>
                        <fa icon="check" class="has-margin-left-medium"/>
                    </button>
                </div>
            </div>
        </template>
    </modal-card>
</template>

<script>

    import ConsultationRequestQuote from '@components/cards/parameters/requestQuote/ConsultationRequestQuote'

    import { ModalCard } from '@enso-ui/modal/bulma'
    import { EnsoForm } from '@enso-ui/forms/bulma'

    import errorHandler from '@components/mixins/errorHandler'
    import dropdownPosition from '@components/mixins/dropdownPosition'

    export default {
        components: {
            ConsultationRequestQuote,

            ModalCard,
            EnsoForm,
        },

        inject: ['i18n', 'canAccess'],

        mixins: [
            errorHandler,
            dropdownPosition,
        ],

        props: {
            stateId: {
                type: Object,
            },
        },

        data() {
            return {
                showConsultationRequestQuote: false,
            };
        },

        methods: {
            ready() {
                this.$nextTick(() => this.addEventListenersInContainer(document.querySelector('.modal-card-body')));
            },

            updateRequestQuote() {
                axios.patch(
                        route('inwork.consultation.requestQuote.update', this.stateId.id),
                        this.$refs.requestQuote.formData,
                    )
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                        this.$emit('saved');
                    })
                    .catch((error) => {
                        this.errorHandler(error, { refForm: this.$refs.requestQuote });
                    });
            },
        },
    };

</script>

<style lang="sass">
.modal__full
    .modal
        &-card
            width: calc(100% - 200px)
            max-width: 1600px
            background-color: white
            border-radius: 6px
            box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
            color: #4a4a4a
            &-foot
                justify-content: flex-end
        &-content
            width: 100%
.request-quote
    &-buttons
        width: 100%
</style>
