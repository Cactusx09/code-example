<template>
    <div>
        <modal-card
            :show="visible"
            class="object_modal"
            @close="
                updateInsuranceObjectParams({
                    url: apiRoutes.getStructure,
                    params: options.params,
                }, false);
                currentForm.insurance_object_snapshot_id = null;
                costEstimateRequest.available = false;
            ">

            <template #header>
                <div class="tile is-vertical">
                    <div class="title is-5">
                        {{ i18n('Obyekt') }}
                    </div>

                    <card-old-data v-if="!!oldData" :data="oldData"/>
                </div>
            </template>

            <template #body>
                <vue-form
                    :path="route(currentForm.url)"
                    :params="currentForm.params"
                    @ready="ready()"
                    :i18n="i18n"
                    :locale="$store.getters['preferences/lang']"
                    ref="object">

                    <template #insurance_object_type_id="props">
                        <form-field
                            v-bind="props"
                            @select="
                                updateInsuranceObjectParams({
                                    insurance_object_type_id: $event,
                                    url: apiRoutes.getStructure,
                                    params: {
                                        insurance_object_type_id: $event,
                                    },
                                }, true);
                            "/>
                    </template>

                    <template #car_plate_number="props">
                        <u-search
                            :table-filters="tableFilters[props.field.name]"
                            :api-url="'/api/dynamicsearch/insuranceObjects/initCarTable'"
                            :min-length="10"
                            @accept="
                                updateInsuranceObjectParams({
                                    url: apiRoutes.searchById,
                                    params: {
                                        insurance_object_id: $event[0].dtRowId,
                                    },
                                }, true);
                                currentForm.insurance_object_snapshot_id = $refs.object.field('insurance_object_snapshot_id').value;
                            ">
                            <form-field
                                v-bind="props"
                                @input="debounceSearch(() => {
                                    tableFilters[props.field.name] = {
                                        insurance_object_cars: {
                                            car_plate_number: props.field.value,
                                        },
                                    };
                                })"/>
                        </u-search>
                    </template>

                    <template #car_vin="props">
                        <u-search
                            :table-filters="tableFilters[props.field.name]"
                            :api-url="'/api/dynamicsearch/insuranceObjects/initCarTable'"
                            :min-length="8"
                            @accept="
                                updateInsuranceObjectParams({
                                    url: apiRoutes.searchById,
                                    params: {
                                        insurance_object_id: $event[0].dtRowId,
                                    },
                                }, true);
                                currentForm.insurance_object_snapshot_id = $refs.object.field('insurance_object_snapshot_id').value;
                            ">
                            <form-field
                                v-bind="props"
                                @input="debounceSearch(() => {
                                    tableFilters[props.field.name] = {
                                        insurance_object_cars: {
                                            car_vin: props.field.value,
                                        },
                                    };
                                })"/>
                        </u-search>
                    </template>

                    <template #car_brand_id="props">
                        <form-field
                            v-bind="props"
                            @input="$refs.object.field('car_model_id').meta.params.brand_id = $event"/>
                    </template>
                    <template #car_model_id="props">
                        <form-field
                            v-bind="props"
                            @selection="getCarTypeFields($event ? $event.car_type.alias : null)"
                            :params="props.field.meta.params"
                            ref="carModelField"/>
                    </template>

                    <template #car_market_price="props">
                        <form-field
                            v-bind="props"
                            @input="$refs.object.field('car_insurance_price').value = props.field.value"/>
                    </template>

                    <template #car_protection_signalling="props">
                        <div class="field">
                            <div class="label">{{ props.field.label }}</div>
                            <div class="buttons has-addons is-paddingless">
                                <div
                                    @click="
                                        props.field.value = 1;
                                        $refs.object.field('car_protection_type_id').meta.hidden = false;
                                    "
                                    :class="['button is-small', { 'is-success is-selected': props.field.value === 1}]">
                                    {{ i18n('Yes') }}
                                </div>
                                <div
                                    @click="
                                        props.field.value = 0;
                                        $refs.object.field('car_protection_type_id').meta.hidden = true;
                                    "
                                    :class="['button is-small', { 'is-danger is-selected': props.field.value === 0 }]">
                                    {{ i18n('No') }}
                                </div>
                            </div>
                        </div>

                    </template>

                    <template #notification>
                        <div
                            v-if="options.params.stateAlias === 'consultation' && typeof $refs.object.field('car_expert_price').value == 'number'"
                            class="columns">
                            <div class="column is-12">
                                <div class="notification is-info">
                                    {{ i18n('Uvaha!!!') }}
                                    <br/>
                                    {{ i18n('Dostupna korektyrovka Rynkovoyi vartosti +- 5%. V razi zmenshennya Rynkovoyi vartosti vid rozrakhovanoyi ekspertom - zbilshennya Bazhanoyi komisiyi bude zablokovano') }}
                                </div>
                            </div>
                        </div>
                    </template>
                </vue-form>
            </template>

            <template #footer>
                <div
                    v-if="visibleCostEstimateRequest"
                    class="footer-switch has-margin-right-medium">
                    <label class="title is-5 has-text-link">{{ i18n('Nadislaty zapyt ekspertu') }}</label>
                    <vue-switch
                        v-model="costEstimateRequest.value"
                        class="has-margin-left-large is-medium is-info"
                    />
                </div>

                <button
                    v-if="!!currentForm.insurance_object_snapshot_id"
                    @click="detachObject()"
                    class="button is-danger is-small">
                    {{ i18n('Vidkripyty') }}
                    <span class="is-small has-margin-left-medium">
                        <fa icon="trash-alt" />
                    </span>
                </button>
                <button
                    class="button is-success"
                    v-prevent-clicks
                    @click="saveObject()">
                    {{ i18n('Save') }}
                    <span class="is-small has-margin-left-medium">
                        <fa icon="save" />
                    </span>
                </button>
            </template>

        </modal-card>

        <confirm-modal :visible.sync="detachConfirmModal"
            title="Vidkripty obyekt?"
            @submit="confirmDetach(detachConfirmModal)">
        </confirm-modal>
    </div>
</template>

<script>
import { ModalCard } from '@enso-ui/modal/bulma'
import ConfirmModal from '@components/ConfirmModal'
import { VueForm, FormField } from '@enso-ui/forms/bulma'
import VueSwitch from '@enso-ui/switch/bulma'

import USearch from '@components/USearch'

import CardOldData from '@components/cards/CardOldData'

import errorHandler from '@components/mixins/errorHandler'
import dropdownPosition from '@components/mixins/dropdownPosition'

export default {
    components: {
        ModalCard,
        ConfirmModal,
        VueForm,
        FormField,
        VueSwitch,
        USearch,
        CardOldData,
    },

    inject: ['i18n'],

    mixins: [
        errorHandler,
        dropdownPosition,
    ],

    props: {
        options: {
            type: Object,
        },
        oldData: {
            type: Object,
        },
    },

    data() {
        return {
            visible: false,
            currentForm: {
                url: this.options.apiRoutes.getStructure,
                params: this.options.params,
            },
            apiRoutes: this.options.apiRoutes,

            tableFilters: {
                car_vin: null,
                car_plate_number: null,
            },
            costEstimateRequest: {
                available: false,
                value: false,
            },
            detachConfirmModal: false,
        };
    },

    computed: {
        visibleCostEstimateRequest() {
            return !!(this.costEstimateRequest.available && this.$refs.object.field('car_used').value);
        },
    },

    methods: {
        ready() {
            this.$refs.object.field('car_model_id').meta.params.brand_id = this.$refs.object.field('car_brand_id').value;

            this.$refs.object.field('car_release_year').meta.options = this.carReleaseDateOptions();
            this.$refs.object.field('passengers_count').meta.options = this.carNumberPlacesOptions();

            if (this.$refs.object.field('car_protection_signalling').value) {
                this.$refs.object.field('car_protection_type_id').meta.hidden = false;
            }

            if (this.currentForm.params.insurance_object_type_id) {
                this.$refs.object.field('insurance_object_type_id').value = this.currentForm.params.insurance_object_type_id;
            }
            if (this.options.params.stateAlias === 'consultation' && !this.$refs.object.field('car_expert_price').value) {
                this.costEstimateRequest.available = true;
            }

            this.$nextTick(() => this.addEventListenersInContainer(document.querySelector('.modal-card-body')));
        },
        updateInsuranceObjectParams(form, visible) {
            this.currentForm = form;
            this.visible = visible;

            if (visible && this.$refs.object) this.replaceFieldsForm(form);
        },
        replaceFieldsForm({ url, params }) {
            axios.get(route(url), { params })
                .then(({ data }) => {
                    data.form.sections.forEach((section) => {
                        section.fields.forEach((field) => {
                            const formField = this.$refs.object.field(field.name);
                            if (!formField.meta.disabled) {
                                formField.value = field.value;
                            }
                        });
                    });

                    if (this.currentForm.insurance_object_type_id) {
                        this.$refs.object.field('insurance_object_type_id').value = this.currentForm.insurance_object_type_id;
                    }
                });
        },

        saveObject() {
            let fields = this.$refs.object.formData;

            if (this.currentForm.insurance_object_snapshot_id) fields.insurance_object_snapshot_id = this.currentForm.insurance_object_snapshot_id;
            if (this.visibleCostEstimateRequest) fields.create_cost_estimate_request = this.costEstimateRequest.value;

            axios.post(
                    route(this.apiRoutes.save),
                    { ...fields, ...this.options.params }
                )
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.updateInsuranceObjectParams(this.apiRoutes.getStructure, false);

                    this.costEstimateRequest.available = false;

                    this.$nextTick(() => this.$emit('saved', data));
                })
                .catch((error) => {
                    this.errorHandler(error, { refForm: this.$refs.object });
                });
        },
        detachObject(insuranceObjectSnapshotId) {
            this.detachConfirmModal = insuranceObjectSnapshotId;
        },
        confirmDetach() {
            axios.post(
                route(this.apiRoutes.detach),
                {
                    consultation_id: this.options.params.consultation_id,
                    snapshot_id: this.currentForm.insurance_object_snapshot_id || this.detachConfirmModal,
                },
            )
            .then(({ data }) => {
                this.$toastr.success(data.message);

                this.visible = false;

                this.$nextTick(() => this.$emit('detached', data));
            })
            .catch((error) => {
                this.errorHandler(error);
            });
        },
        carReleaseDateOptions() {
            const currentYear = new Date().getYear() + 1900;

            return Array.from({ length: 70 }, (el, index) => {
                return {
                    id: currentYear - index,
                    name: currentYear - index,
                }
            });
        },
        carNumberPlacesOptions() {
            return Array.from({ length: 40 }, (el, index) => {
                return {
                    id: index + 1,
                    name: index + 1,
                }
            });
        },
        getCarTypeFields(alias) {
            if (alias === 'truck') {
                this.$refs.object.field('passengers_count').meta.hidden = true;
                this.$refs.object.field('car_load_capacity').meta.hidden = false;
            } else if (['microbus', 'bus'].includes(alias)) {
                this.$refs.object.field('passengers_count').meta.hidden = false;
                this.$refs.object.field('car_load_capacity').meta.hidden = true;
            } else {
                this.$refs.object.field('passengers_count').meta.hidden = true;
                this.$refs.object.field('car_load_capacity').meta.hidden = true;
            }
        },
        debounceSearch: _.debounce(function (method) {
            return method();
        }, 1000),
    },
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"

.object_modal
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
        +desktop-only
            width: calc(100% - 100px)
        +tablet-only
            width: calc(100% - 100px)
        +mobile
            width: calc(100% - 100px)
        // &-body
        //     form
        //         .columns
        //             &:nth-last-of-type(3)
        //                 .dropdown-menu
        //                     bottom: 100%
        //                     padding-bottom: 4px
        //                     padding-top: initial
        //                     top: auto
        &-foot
            justify-content: flex-end
    .field
        &:not(:last-of-type)
            margin-bottom: 0
    .u-search
        .input
            background: #ffdd5733
    .footer-switch
        display: flex
        align-items: center
        .title
            margin-bottom: .2em
            font-weight: bold

    .modal-card-head
        .message
            margin-top: -1rem
    .modal-card-body
        .column
            position: relative
        .tag
            position: absolute
            right: .75rem
            top: .65rem

</style>
