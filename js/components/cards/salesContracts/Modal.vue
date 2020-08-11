<template>
    <modal-card
        :show="show"
        class="salesContracts_modal"
        @close="$emit('close')">

        <template #header>
            <div class="title is-5">
                {{ i18n('Dogovir kupivli-prodazhu') }}
            </div>
        </template>

        <template #body>
            <vue-form
                :path="route('inwork.contracts.creditSolutions.salesContracts.fetchForm')"
                :params="{
                    insurance_contract_id: stateId,
                }"
                ref="form"
                :i18n="i18n"
                :locale="$store.getters['preferences/lang']"
                @loaded="filledByAgency($refs.form.field('is_filled_by_agency').value ? true : false)">
                <template #is_filled_by_agency="props">
                    <form-field
                        v-bind="props"
                        @input="
                            filledByAgency($event);
                            sameCarDealer(['name', 'edrpou', 'account_id']);
                        "/>
                </template>

                <template #car_dealer_name="props">
                    <form-field
                        v-bind="props"
                        @changed="sameCarDealer(['name'])"/>
                </template>
                <template #car_dealer_edrpou="props">
                    <form-field
                        v-bind="props"
                        @changed="sameCarDealer(['edrpou'])"/>
                </template>
                <template #car_dealer_account_id="props">
                    <form-field
                        v-bind="props"
                        @changed="sameCarDealer(['account_id'])"/>
                </template>

                <template #is_do_same_as_agency="props">
                    <form-field
                        v-bind="props"
                    @input="sameCarDealer(['name', 'edrpou', 'account_id'])"/>
                </template>

                <template #do_dealer_name="props">
                    <form-field
                        v-bind="props"
                        @changed="$refs.form.field('is_do_same_as_agency').value = false"/>
                </template>
                <template #do_dealer_edrpou="props">
                    <form-field
                        v-bind="props"
                        @changed="$refs.form.field('is_do_same_as_agency').value = false"/>
                </template>
                <template #do_dealer_account_id="props">
                    <form-field
                        v-bind="props"
                        @changed="$refs.form.field('is_do_same_as_agency').value = false"/>
                </template>
            </vue-form>

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
    components: {
        ModalCard,

        VueForm,
        FormField,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

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

            axios.post(route('inwork.contracts.creditSolutions.salesContracts.saveForm'), fields)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$emit('saved');
                    this.$emit('close');
                })
                .catch((error) => {
                    this.errorHandler(error, { refForm: this.$refs.form });
                });
        },
        filledByAgency(checkedEqual) {
            const fieldNamesSuffix = [
                'name',
                'edrpou',
                'account_id',
            ];

            fieldNamesSuffix.forEach((suffix) => {
                if (checkedEqual) {
                    this.$refs.form.field(`car_dealer_${suffix}`).value = this.$refs.form.field(`agency_dealer_${suffix}`).value;
                }

                this.$refs.form.field(`car_dealer_${suffix}`).meta.disabled = checkedEqual;
            });
        },
        sameCarDealer(fieldNamesSuffix) {
            if (this.$refs.form.field('is_do_same_as_agency').value) {
                fieldNamesSuffix.forEach((suffix) => {
                    this.$refs.form.field(`do_dealer_${suffix}`).value = this.$refs.form.field(`car_dealer_${suffix}`).value;
                });
            }
        },
    }
}
</script>

<style lang="sass">
    .salesContracts_modal
        .title
            b
                margin-left: .3rem
                font-size: 1.3rem
                font-wight: 700
            &.is-5
                font-size: 1.15rem

        .modal-card
            width: calc(100% - 200px)
            max-width: 1600px
            background-color: white
            border-radius: 6px
            box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
            color: #4a4a4a
            &-foot
                justify-content: flex-end
        .field
            &:not(:last-of-type)
                margin-bottom: 0

        .button-back
            &.button
                margin-right: auto
</style>
