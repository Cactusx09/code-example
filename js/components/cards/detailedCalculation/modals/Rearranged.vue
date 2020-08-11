<template>
    <modal-card :show="show"
        @close="$emit('close')"
        class="renew__modal">
        <template #header>
            <div class="level">
                <div class="level-left">
                    <div class="title is-5">
                        {{ i18n('Pereuklasty') }}
                    </div>
                </div>
            </div>
        </template>

        <template #body>
            <div class="columns">
                <div class="column is-3">
                    <element-validation v-model="data.series"
                        :label="'Seriya blanka'"
                        :name="'series'"
                        :errors="errors"
                        type="number"/>
                </div>

                <div class="column is-3">
                    <element-validation v-model="data.number"
                        :label="'Nomer blanka'"
                        :name="'number'"
                        :errors="errors"
                        type="number"/>
                </div>

                <element-validation class="renew__modal_uploader column is-6"
                    :name="'file'"
                    :errors="errors">
                    <uploader v-model="file"
                        ref="fileUploader"
                        api
                        @upload="
                            uploadFile();
                            errors.clear('file');
                        ">
                        <span>
                            {{ i18n('Dodaty dokument') }}
                            <fa class="has-margin-left-medium"
                                icon="upload"/>
                        </span>
                    </uploader>
                </element-validation>
            </div>

            <div>
                <p class="has-margin-bottom-large">
                    {{ i18n('Oberit\' sutnist\', yaka potrebuye zminy ta zminit\' yiyi znachennya') }}
                </p>
            </div>

            <enso-form :path="''"
                :template="clientForm"
                ref="client"/>

            <enso-form :path="''"
                :template="insuranceObjectForm"
                ref="object">
                <template #car_plate_number="props">
                    <u-search :table-filters="tableFilters[props.field.name]"
                        :api-url="'/api/dynamicsearch/insuranceObjects/initCarTable'"
                        :min-length="10"
                        @accept="searchInsuranceObject($event[0].dtRowId)">
                        <form-field v-bind="props"
                            @input="tableFilters[props.field.name] = {
                                insurance_object_cars: {
                                    car_plate_number: props.field.value,
                                },
                            }"/>
                    </u-search>
                </template>

                <template #car_release_year="props">
                    <label class="label">{{ i18n(props.field.label) }}</label>
                    <vue-select v-bind="props"
                        v-model="props.field.value"
                        :options="carReleaseDateOptions()"/>
                </template>

                <template #car_vin="props">
                    <u-search
                        :table-filters="tableFilters[props.field.name]"
                        :api-url="'/api/dynamicsearch/insuranceObjects/initCarTable'"
                        :min-length="8"
                        @accept="searchInsuranceObject($event[0].dtRowId)">
                        <form-field
                            v-bind="props"
                            @input="tableFilters[props.field.name] = {
                                insurance_object_cars: {
                                    car_vin: props.field.value,
                                },
                            }"/>
                    </u-search>
                </template>
            </enso-form>

            <div class="columns">
                <element-validation class="column"
                    :name="'notes'"
                    :errors="errors">
                    <textarea v-model="data.notes"
                        :class="['textarea', { 'is-danger': errors.has('notes') }]"
                        @input="errors.clear('notes')"></textarea>
                </element-validation>
            </div>

            <confirm-modal :visible.sync="confirm"
                title="Anulyuvaty blank v zvyazku z pereukladennyam"
                @submit="save()"
                class="renew__confirm">
            </confirm-modal>
        </template>

        <template #footer>
            <button class="button is-danger is-small"
                @click="$emit('close')">
                {{ i18n('cancel') }}
            </button>

            <button class="button is-success"
                @click="confirm = true">
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
import { VueSelect } from '@enso-ui/select/bulma'
import Uploader from '@components/Uploader'
import USearch from '@components/USearch'
import ConfirmModal from '@components/ConfirmModal'

import ElementValidation from '@components/validations/ElementValidation'
import Errors from '@enso-ui/forms/errors'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
        ConfirmModal,
        EnsoForm,
        VueSelect,
        FormField,
        Uploader,
        USearch,
        ElementValidation,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        calculationProductId: Number,
    },

    data() {
        return {
            show: false,
            confirm: false,
            data: {
                series: null,
                number: null,
                notes: null,
            },
            tableFilters: {
                car_vin: null,
                car_plate_number: null,
            },
            clientForm: {},
            insuranceObjectForm: {},
            file: null,
            errors: new Errors(),
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(route('inwork.contracts.fetchDetailedCalculationRearrangedForm'), {
                    params: {
                        calculation_id: this.calculationProductId,
                    }
                })
                .then(({ data }) => {
                    Object.keys(this.data).forEach((name, index) => this.data[name] = data[name]);

                    this.clientForm = data.clientForm;
                    this.insuranceObjectForm = data.insuranceObjectForm;

                    this.show = true;

                    this.$nextTick(() => this.$refs.fileUploader.updateOptions(data.file));
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });

                    this.$emit('close');
                });
        },

        uploadFile() {
            let formData = this.file;
            formData.append('calculation_id', this.calculationProductId);

            axios.post(route('inwork.contracts.uploadRearrangedDocument'), formData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$refs.fileUploader.updateOptions({
                        uploaded: true,
                        file_name: data.file_name,
                        url: data.url,
                        delete_url: data.delete_url,
                    });
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        save() {
            const formData = {
                calculation_id: this.calculationProductId,
                clientForm: this.$refs.client.formData,
                insuranceObjectForm: this.$refs.object.formData,
                ...this.data
            }

            axios.post(route('inwork.contracts.saveDetailedCalculationRearrangedForm'), formData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$emit('close');
                    this.$emit('save');
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        searchInsuranceObject(insuranceObjectId) {
            axios.get(route('inwork.consultations.searchInsuranceObjectById'), {
                    params: {
                        insurance_object_id: insuranceObjectId,
                    }
                })
                .then(({ data }) => {
                    for (let section of data.form.sections) {
                        for (let field of section.fields) {
                            this.$refs.object.field(field.name).value = field.value;
                        }
                    }
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
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
    }
}
</script>

<style lang="sass">
.renew
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
        &_uploader
            display: flex
            justify-content: flex-end
            align-items: flex-end
    &__confirm
        z-index: 41
</style>
