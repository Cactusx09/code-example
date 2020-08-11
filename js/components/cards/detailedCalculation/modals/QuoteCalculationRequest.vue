<template>
    <modal-card
        :show="show"
        @close="$emit('close')"
        class="quoteCalc__modal">
        <template #header>
            <div class="level">
                <div class="level-left">
                    <div class="tags has-addons has-margin-right-large">
                        <small class="tag is-medium is-info">{{ data.product_code.value }}</small>
                        <span class="tag is-medium is-primary">{{ data.product_subtype_name.value }}</span>
                    </div>
                    <b>{{ data.product_name.value }}</b>
                </div>

                <div class="level-center">
                    {{ i18n('Zapyt kotyruvan') }}
                </div>

                <div class="level-right has-text-info">
                    {{ data.status_name.value }}
                </div>
            </div>
        </template>

        <template #body>
            <div class="columns is-multiline has-margin-bottom-large">
                <div class="column is-12">
                    <divider class="has-margin-bottom-medium"
                        :title="i18n('Parametry produktu')"/>
                </div>

                <div class="column">
                    <div class="wizard__columns columns">
                        <card-list v-for="(item, key) in data.searchConditions"
                            :key="`searchConditions:${key}`"
                            class="column is-2"
                            :label="item.label"
                            :content="[
                                item.value,
                            ]"
                            vertical/>
                    </div>
                </div>
            </div>

            <div class="columns is-multiline has-margin-bottom-large">
                <div class="column is-12">
                    <divider class="has-margin-bottom-medium"
                        :title="i18n('Rezultat rozrakhunkiv')"/>
                </div>

                <div class="column">
                    <div class="wizard__columns columns">
                        <card-list v-for="(item, key) in data.insuranceLogicVariables"
                            :key="`insuranceLogicVariables${key}`"
                            class="column is-2"
                            :label="item.label"
                            :content="[
                                item.value,
                            ]"
                            vertical/>
                    </div>
                </div>
            </div>

            <vue-form :path="''"
                :i18n="i18n"
                :template="fieldsForm"
                :locale="$store.getters['preferences/lang']"
                ref="form"/>
        </template>

        <template #footer>
            <button class="button is-danger is-small"
                @click="$emit('close')">
                {{ i18n('cancel') }}
            </button>

            <button class="button is-success"
                @click="save()">
                {{ i18n('save') }}
                <span class="is-small has-margin-left-medium">
                    <fa icon="save"/>
                </span>
            </button>
        </template>
    </modal-card>
</template>

<script>
import CardList from '@components/cards/CardList'

import { ModalCard } from '@enso-ui/modal/bulma'
import { VueForm } from '@enso-ui/forms/bulma'
import Divider from '@enso-ui/divider'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        CardList,
        ModalCard,
        VueForm,
        Divider,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        calculationProductId: Number,
    },

    data() {
        return {
            show: false,
            data: {},
            fieldsForm: {},
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(route('inwork.contracts.quoteCalculation'), {
                    params: {
                        calculation_id: this.calculationProductId,
                    }
                })
                .then(({ data }) => {
                    this.data = data.calculationCard;
                    this.fieldsForm = data.quoteForm.form;
                    this.show = true;
                })
                .catch((error) => {
                    this.errorHandler(error, { refForm: this.$refs.form });

                    this.$emit('close');
                });
        },

        save() {
            const formData = {
                calculation_id: this.calculationProductId,
                quote_data: {
                    fields: this.$refs.form.formData,
                },
            };

            axios.post(route('inwork.contracts.saveQuote'), formData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$emit('close');
                    this.$emit('save', data);
                })
                .catch((error) => {
                    this.errorHandler(error, { refForm: this.$refs.form });
                });
        },
    }
}
</script>

<style lang="sass">
.quoteCalc
    &__modal
        .modal
            &-card
                width: calc(100% - 200px)
                max-width: 1600px
                background-color: white
                border-radius: 6px
                box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
                color: #4a4a4a
                &-head
                    font-weight: 700
                    .level
                        width: 100%
                        &-center,
                        &-left,
                        &-right
                            width: 30%
                        &-center
                            display: flex
                            justify-content: center
                        .tags
                            margin-bottom: 0
                            .tag
                                margin-bottom: 0

                        b
                            font-weight: 700
                            font-size: 1.3rem
                &-foot
                    justify-content: flex-end
            &-content
                width: 100%
</style>
