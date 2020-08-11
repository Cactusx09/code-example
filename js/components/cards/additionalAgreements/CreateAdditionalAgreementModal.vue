<template>
    <modal-card show
        class="additionalAgreements_modal"
        @close="$emit('close')">
        <template #header>
            <div class="title is-5">
                {{ i18n('Stvoryty dodatkovu uhodu') }}
            </div>
        </template>

        <template #body>
            <div class="columns">
                <div class="column">
                    <label class="label">{{ i18n('Oberit dohovir') }}</label>
                    <vue-select v-model="data.calculation_id"
                        :options="optionsCalculation"
                        :placeholder="i18n('Oberit')"/>
                </div>
            </div>

            <div class="columns">
                <div class="column">
                    <label class="label">{{ i18n('Oberit typ dodatkovoyi uhody') }}</label>
                    <vue-select v-model="data.additional_agreement_type_id"
                        :source="'/api/administration/additionalAgreementTypes/options'"
                        :placeholder="i18n('Oberit')"/>
                </div>
            </div>
        </template>

        <template #footer>
            <button class="button button-back is-primary"
                @click="$emit('close')">
                <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                <fa icon="arrow-left" class="has-margin-left-medium"/>
            </button>
            <button class="button is-success"
                @click="create()">
                <span class="is-hidden-mobile">{{ i18n('Create') }}</span>
                <fa icon="check" class="has-margin-left-medium"/>
            </button>
        </template>
    </modal-card>
</template>

<script>
import { ModalCard } from '@enso-ui/modal/bulma'
import { VueSelect } from '@enso-ui/select/bulma'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
        VueSelect,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        contractId: [Number, String],
    },

    data() {
        return {
            data: {
                calculation_id: null,
                additional_agreement_type_id: null,
            },
            optionsCalculation: [],
        }
    },

    created() {
        this.getCalculationOptions();
    },

    methods: {
        getCalculationOptions() {
            axios.get('/api/inwork/contracts/additionalAgreements/calculationOptions', {
                    params: {
                        insurance_contract_id: this.contractId,
                    }
                })
                .then(({ data }) => {
                    this.optionsCalculation = data;

                    this.show = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        create() {
            axios.post('/api/inwork/contracts/additionalAgreements/create', this.data)
                .then(({ data }) => {
                    this.$toastr.success(this.i18n(data.message));

                    this.$emit('fetch', data.policy_additional_agreement_id);

                    this.$emit('close');
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        }
    }
}
</script>

<style lang="sass">
.additionalAgreements_modal
    .modal-card,
    .modal-card-body
        overflow: visible
    .button-back
        &.button
            margin-right: auto
</style>
