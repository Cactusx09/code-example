<template>
    <modal-card
        show
        @close="$emit('close')"
    >
        <template #header>
            {{`${insuranceObject.car_brand_name || ''} ${insuranceObject.car_model_name || ''} ${insuranceObject.car_modification || ''} ${insuranceObject.car_release_year ? insuranceObject.car_release_year + ' ' + i18n('rik') : ''}${insuranceObject.car_engine_size ? ', ' + insuranceObject.car_engine_size : ''}${insuranceObject.car_transmission_name ? ', ' + insuranceObject.car_transmission_name : ''}${insuranceObject.fuel_name ? ', ' + insuranceObject.fuel_name : ''}`}}
        </template>
        <template #body>
            <div class="columns">
                <div class="column">
                    <label class="label">{{ i18n('Strakhova vartist') }}</label>
                </div>
                <div class="column">
                    <p>{{ insuranceObject.car_insurance_price }}</p>
                </div>
            </div>

            <div class="columns">
                <div class="column">
                    <label class="label">{{ i18n('Ekspertna vartist avto, hrn') }}</label>
                </div>
                <div class="column">
                    <input
                        v-model="expertCost"
                        class="input"
                    />
                </div>
            </div>
        </template>
        <template #footer>
            <div class="level-right" style="width: 100%">
                <button
                    class="button is-danger is-small"
                    @click="$emit('close')">
                    {{ i18n('cancel') }}
                </button>

                <button
                    class="button is-success"
                    v-prevent-clicks
                    @click="save()">
                    {{ i18n('save') }}
                    <span class="is-small has-margin-left-medium">
                        <fa icon="save"/>
                    </span>
                </button>
            </div>
        </template>
    </modal-card>
</template>

<script>

import { ModalCard } from '@enso-ui/modal/bulma'
import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
    },

    props: {
        insuranceObject: {
            type: Object,
            default: null,
        },
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    data() {
        return {
            expertCost: this.insuranceObject.expert_cost,
        };
    },

    methods: {
        save() {
            axios.post(`/api/administration/carCostEstimateRequests/${this.insuranceObject.dtRowId}/process`, {
                    expert_cost: this.expertCost,
                })
                .then(({ data }) => {
                    this.$toastr.success(this.i18n(data.message));
                    this.$emit('close');
                    this.$emit('save');
                })
                .catch(error => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>
