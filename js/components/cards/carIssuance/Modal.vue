<template>
    <modal-card :show="show"
        @close="$emit('close')">
        <template #header>
            <div>{{ i18n('Pidtverdzhennya vydachi avto kliyentu') }}</div>
        </template>

        <template #body>
            <div class="box has-background-danger has-text-white">
                <p class="has-margin-bottom-medium">
                    <span class="title is-5 has-text-white">{{ i18n('UVAHA') }}!!!</span>
                </p>
                <span>{{ i18n('Vydacha avtomobilya kliyentovi vidbuvayet\'sya til\'ky za umovy nadkhodyeennya 100% vartosti avtomobilya na rakhunok prodavtsya avtomobilya!') }}</span>
            </div>

            <vue-form
                :path="route('inwork.contracts.creditSolutions.carIssuance.fetchForm')"
                :params="{
                    insurance_contract_id: stateId,
                }"
                :i18n="i18n"
                :locale="$store.getters['preferences/lang']"
                ref="form">
            </vue-form>
        </template>

        <template #footer>
            <button
                class="button button-back is-primary"
                @click="$emit('close')">
                <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                <fa icon="arrow-left" class="has-margin-left-medium"/>
            </button>
            <button
                class="button is-success"
                @click="save()">
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
        ModalCard,

        VueForm,
    },

    props: {
        stateId: Number,
        show: Boolean,
    },

    methods: {
        save() {
            const fields = {
                insurance_contract_id: this.stateId,
                ...this.$refs.form.formData,
            };

            axios.post(route('inwork.contracts.creditSolutions.carIssuance.saveForm'), fields)
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
