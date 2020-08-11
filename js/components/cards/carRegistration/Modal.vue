<template>
    <modal-card
        :show="show"
        @close="$emit('close')">
        <template #header>
            <div>{{ `${i18n('Reyestratsiya avto')}` }} <b>{{ name }}</b></div>
        </template>
        <template #body>
            <div>
                <vue-form
                    :path="route('inwork.contracts.creditSolutions.fetchRegistrationForm')"
                    :params="{
                        insurance_contract_id: stateId,
                    }"
                    :i18n="i18n"
                    :locale="$store.getters['preferences/lang']"
                    ref="form">
                </vue-form>
            </div>
        </template>
        <template #footer>
            <button
                @click="$emit('close')"
                class="button button-back is-primary">
                <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                <fa icon="arrow-left" class="has-margin-left-medium"/>
            </button>
            <button
                @click="save()"
                class="button is-success">
                <span class="is-hidden-mobile">{{ i18n('Save') }}</span>
                <fa icon="check" class="has-margin-left-medium"/>
            </button>
        </template>
    </modal-card>
</template>

<script>
import { ModalCard } from '@enso-ui/modal/bulma'

import { VueForm } from '@enso-ui/forms/bulma'

import errorHandler from '@components/mixins/errorHandler'

export default {
    inject: ['i18n'],

    mixins: [errorHandler],

    components: {
        VueForm,
        ModalCard,
    },

    props: {
        stateId: Number,
        name: String,
        show: Boolean,
    },

    methods: {
        save() {
            const fields = {
                insurance_contract_id: this.stateId,
                ...this.$refs.form.formData,
            };

            axios.post(route('inwork.contracts.creditSolutions.saveRegistrationForm'), fields)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$emit('saved');
                    this.$emit('close');
                })
                .catch((error) => {
                    this.errorHandler(error, { refForm: this.$refs.form });
                });
        },
    },
}
</script>

<style lang="sass" scoped>
    .button-back
        &.button
            margin-right: auto
    .card-header-title
        b
            font-weight: 700
            margin-left: 1rem
</style>
