<template>
    <modal-card
        :show="show"
        @close="$emit('close')">
        <template #header>
            <div>{{ i18n('Pryznachennya na kred/lizynh uhodu') }}</div>
        </template>
        <template #body>
            <div>
                <vue-form
                    :path="route(apiRoutes.fetchForm)"
                    :params="{
                        insurance_contract_id: stateId,
                    }"
                    :locale="$store.getters['preferences/lang']"
                    ref="form">
                    <template #manager_phone="props">
                        <label class="label">{{ i18n(props.field.label) }}</label>
                        <input-phone v-bind="props"/>
                    </template>
                </vue-form>
            </div>
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
import InputPhone from '@components/vueforms/InputPhone'

import errorHandler from '@components/mixins/errorHandler'

export default {
    inject: ['i18n'],

    mixins: [errorHandler],

    components: {
        ModalCard,

        VueForm,
        InputPhone,
    },

    props: {
        stateId: Number,
        show: Boolean,
        apiRoutes: Object,
    },

    methods: {
        save() {
            const fields = {
                insurance_contract_id: this.stateId,
                ...this.$refs.form.formData
            };

            axios.post(route(this.apiRoutes.saveForm), fields)
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
