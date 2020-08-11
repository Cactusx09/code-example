<template>
    <modal-card :show="show"
        @close="$emit('close')"
        class="detailedCalcDuplicate__modal">
        <template #header>
            <div class="title is-5">
                {{ i18n('Stvoryty dublikat') }}
            </div>
        </template>

        <template #body>
            <div class="columns">
                <element-validation class="column is-12"
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

            <div class="columns">
                <element-validation v-model="data.series"
                    class="column is-6"
                    :label="'Seriia blanka'"
                    :name="'series'"
                    :errors="errors"/>

                <element-validation v-model="data.number"
                    class="column is-6"
                    :label="'Nomer blanka'"
                    :name="'number'"
                    :errors="errors"
                    type="number"/>
            </div>

            <div class="columns">
                <element-validation class="column"
                    :name="'notes'"
                    :errors="errors">
                    <textarea v-model="data.notes"
                        :class="['textarea', { 'is-danger': errors.has('notes') }]"
                        @input="errors.clear('notes')"/>
                </element-validation>
            </div>
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

import Uploader from '@components/Uploader'

import ElementValidation from '@components/validations/ElementValidation'
import Errors from '@enso-ui/forms/errors'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
        Uploader,
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
            data: {
                series: null,
                number: null,
                notes: null,
            },
            file: null,
            errors: new Errors(),
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(route('inwork.contracts.fetchDetailedCalculationDuplicateForm'), {
                    params: {
                        calculation_product_id: this.calculationProductId,
                    },
                })
                .then(({ data }) => {
                    Object.keys(this.data).forEach((name) => this.data[name] = data[name]);
                    this.show = true;

                    this.$nextTick(() => this.$refs.fileUploader.updateOptions(data.duplicate_document));
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });

                    this.$emit('close');
                });
        },

        uploadFile() {
            let formData = this.file;
            formData.append('calculation_product_id', this.calculationProductId);

            axios.post(route('inwork.contracts.uploadDuplicateDocument'), formData)
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
            axios.post(route('inwork.contracts.saveDetailedCalculationDuplicateForm'), {
                    calculation_product_id: this.calculationProductId,
                    ...this.data
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$emit('close');
                    this.$emit('save');
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
    }
}
</script>

<style lang="sass">
.detailedCalcDuplicate
    &__modal
        &_header
            width: 100%
        .title
            b
                margin-left: .3rem
                font-size: 1.3rem
                font-wight: 700
            &.is-5
                font-size: 1.15rem

        .modal-card
            background-color: white
            border-radius: 6px
            box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
            color: #4a4a4a
            &-foot
                justify-content: flex-end
        .field
            &:not(:last-of-type)
                margin-bottom: 0
</style>
