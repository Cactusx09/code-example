<template>
    <modal-card :show="show"
        @close="$emit('close')"
        class="detailedCalcSpoil__modal">
        <template #header>
            <div class="level">
                <div class="level-left">
                    <div class="title is-5">
                        {{ i18n('Zipsuvaty blank') }}
                    </div>
                </div>
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
                            {{ i18n('Dodayte zayavu') }}
                            <fa class="has-margin-left-medium"
                                icon="upload"/>
                        </span>
                    </uploader>
                </element-validation>
            </div>

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
                title="Zipsuvaty blank?"
                @submit="save()"
                class="detailedCalcSpoil__confirm">
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
import Uploader from '@components/Uploader'
import ConfirmModal from '@components/ConfirmModal'

import ElementValidation from '@components/validations/ElementValidation'
import Errors from '@enso-ui/forms/errors'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ModalCard,
        ConfirmModal,
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
            confirm: false,
            data: {
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
            axios.get(route('inwork.contracts.fetchDetailedCalculationSpoilForm'), {
                    params: {
                        calculation_product_id : this.calculationProductId,
                    },
                })
                .then(({ data }) => {
                    this.data.notes = data.notes;
                    this.show = true;

                    this.$nextTick(() => this.$refs.fileUploader.updateOptions(data.spolied_document));
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });

                    this.$emit('close');
                });
        },

        uploadFile() {
            let formData = this.file;
            formData.append('calculation_product_id', this.calculationProductId);

            axios.post(route('inwork.contracts.uploadSpoiledDocument'), formData)
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
            axios.post(route('inwork.contracts.saveDetailedCalculationSpoilForm'), {
                    calculation_product_id : this.calculationProductId,
                    notes: this.data.notes,
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
    .detailedCalcSpoil
        &__modal
            .level
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
        &__confirm
            .modal-content
                width: 320px
</style>
