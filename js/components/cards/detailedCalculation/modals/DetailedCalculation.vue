<template>
    <modal show
        @close="$emit('close')"
        class="detailedCalc__modal">
        <vue-form class="box has-background-light raises-on-hover animated fadeIn"
            :path="route('inwork.contracts.getDetailedCalculationForm')"
            :params="{
                insurance_consultation_product_calculation_id: calculationProductId,
            }"
            :i18n="i18n"
            :locale="$store.getters['preferences/lang']"
            v-on="$listeners"
            ref="form"
            @submit="
                $emit('close');
                $emit('save');
            ">
            <template #policy_begin_datetime="props">
                <form-field v-bind="props"
                    @input="getCalculatePolicyEndDatetime($event)"/>
            </template>
        </vue-form>
    </modal>
</template>

<script>
import { ModalCard, Modal } from '@enso-ui/modal/bulma'
import { VueForm, FormField } from '@enso-ui/forms/bulma'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
        Modal,
        VueForm,
        FormField,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        calculationProductId: Number,
    },

    methods: {
        getCalculatePolicyEndDatetime(value) {
            if (!value) {
                this.$refs.form.field('policy_end_datetime').value = null;
                return;
            }

            axios.get(route('inwork.contracts.calculatePolicyEndDatetime'), {
                    params: {
                        insurance_consultation_product_calculation_id: this.calculationProductId,
                        policy_begin_datetime: value,
                    },
                })
                .then(({ data }) => {
                    this.$refs.form.field('policy_end_datetime').value = data.replace(/[\.]/g,'-').split(' ')[0];
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
}
</script>

<style lang="sass">
.detailedCalc
    &__modal
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
                width: calc(100% - 200px)
</style>
