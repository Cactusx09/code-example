<template>
    <modal-card
        :show="init"
        class="modal__full modal__full_consultation"
        @close="$emit('close')">
        <template #header>
            <div class="title is-5">
                {{ i18n('Zminyty parametry') }}
            </div>
        </template>

        <template #body>
            <div class="column is-12">
                <divider class="has-margin-bottom-medium"
                    :title="i18n('Kredytni parametry')"/>
            </div>

            <div class="calculation-card-columns columns is-variable is-0">
                <card-list v-for="(item, key) in data.searchConditions"
                    :key="`searchConditions:${key}`"
                    class="column is-3"
                    :label="item.label"
                    :content="[item.value]"
                    vertical/>
            </div>

            <div class="calculation-card-columns columns is-variable is-0">
                <card-list v-for="(item, key) in data.insuranceLogicVariables"
                    :key="`insuranceLogicVariable:${key}`"
                    :class="[
                        'column is-3', key
                    ]"
                    :label="item.label"
                    :content="[item.value]"
                    vertical>
                    <template v-slot="{ label }">
                        <div v-if="key === 'total_credit_amount'"
                            class="buttons has-addons has-margin-right-large">
                            <div class="button is-primary is-outlined has-text-dark is-static">{{ label }}</div>
                            <div class="button is-primary"><b>{{ item.value | numberFormat(2) }}</b></div>
                        </div>
                    </template>
                </card-list>
            </div>

            <div class="column is-12">
                <divider class="has-margin-bottom-medium"
                    :title="i18n('Koryhuvannya umov kredytuvannya')"/>
            </div>

            <enso-form
                :path="''"
                :template="templateForm"
                @ready="ready()"
                ref="form">
                <template #is_custom_credit_program="props">
                    <form-field
                        v-bind="props"
                        @input="changeCustomCreditProgram()"
                    />
                </template>

                <template #prepayment_rate="props">
                    <form-field
                        v-bind="props"
                        @input="$refs.form.field('total_credit_amount').value = null"
                    />
                </template>
            </enso-form>
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

    import { ModalCard } from '@enso-ui/modal/bulma'
    import { EnsoForm, FormField } from '@enso-ui/forms/bulma'
    import CardList from '@components/cards/CardList'

    import Divider from '@enso-ui/divider'

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            ModalCard,
            EnsoForm,
            FormField,
            CardList,
            Divider,
        },

        props: {
            data: {
                type: Object,
                required: true,
            },
            contractId: [String, Number],
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                init: false,
                templateForm: {},
                errors: new Errors(),
            };
        },

        created() {
            this.fetch();
        },

        methods: {
            ready() {
                if (!this.$refs.form) return;

                if (!this.data.insuranceLogicVariables.additional_credit_subject_amount.value) {
                    this.$refs.form.field('credit_subject_amount').meta.hidden = true;
                    this.$refs.form.field('additional_prepayment_amount').meta.hidden = true;
                    this.$refs.form.field('additional_credit_subject_amount').meta.hidden = true;
                }

                this.changeCustomCreditProgram();
            },

            changeCustomCreditProgram() {
                if (this.$refs.form.field('is_custom_credit_program').value) {
                    this.$refs.form.field('credit_program_id').value = null;
                    this.$refs.form.field('credit_program_id').meta.disabled = true;
                } else {
                    this.$refs.form.field('credit_program_id').meta.disabled = false;

                    this.$refs.form.field('monthly_bank_commission_rate').meta.hidden = !this.data.insuranceLogicVariables.monthly_bank_commission_rate.value;
                    this.$refs.form.field('monthly_bank_commission_amount').meta.hidden = !this.data.insuranceLogicVariables.monthly_bank_commission_amount.value;
                }
            },

            fetch() {
                axios.get(route('inwork.contracts.bankExpert.quoteCreditCalculation'), {
                        params: {
                            insurance_contract_id: this.contractId,
                        }
                    })
                    .then(({ data }) => {
                        this.templateForm = data;
                        this.init = true;
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            save() {
                const formData = {
                    insurance_contract_id: this.contractId,
                    ...this.$refs.form.formData,
                }

                axios.post(route('inwork.contracts.bankExpert.saveCreditQuote'), formData)
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));

                        this.$emit('saved');
                        this.$emit('close');
                    })
                    .catch((error) => {
                        this.errorHandler(error, { setErrorsFlag: true });
                    });
            },
        },
    };

</script>
