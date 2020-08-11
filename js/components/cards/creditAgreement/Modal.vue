<template>
    <modal-card
        :show="show"
        @close="$emit('close')">
        <template #header>
            <div>{{ i18n('Pidtverdzhennya na kred/lizynh uhodu') }}</div>
        </template>
        <template #body>
            <div>
                <vue-form
                    :path="route('inwork.contracts.creditAgreement.confirmation.fetchForm')"
                    :params="{
                        insurance_contract_id: stateId,
                    }"
                    :i18n="i18n"
                    :locale="$store.getters['preferences/lang']"
                    ref="form">
                    <template #car_credit_amount="props">
                        <form-field
                            v-bind="props"
                            @input="$refs.form.field('total_credit_amount').value = props.field.value + $refs.form.field('do_credit_amount').value + $refs.form.field('kasko_credit_amount').value"/>
                    </template>
                    <template #do_credit_amount="props">
                        <form-field
                            v-bind="props"
                            @input="$refs.form.field('total_credit_amount').value = props.field.value + $refs.form.field('car_credit_amount').value + $refs.form.field('kasko_credit_amount').value"/>
                    </template>
                    <template #kasko_credit_amount="props">
                        <form-field
                            v-bind="props"
                            @input="$refs.form.field('total_credit_amount').value = props.field.value + $refs.form.field('do_credit_amount').value + $refs.form.field('car_credit_amount').value"/>
                    </template>
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

import { VueForm, FormField } from '@enso-ui/forms/bulma'

import errorHandler from '@components/mixins/errorHandler'

export default {
    inject: ['i18n'],

    mixins: [errorHandler],

    components: {
        ModalCard,

        VueForm,
        FormField,
    },

    props: {
        stateId: Number,
        show: Boolean,
    },

    methods: {
        save() {
            const fields = {
                insurance_contract_id: this.stateId,
                ...this.$refs.form.formData
            };

            axios.post(route('inwork.contracts.creditAgreement.confirmation.saveForm'), fields)
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
