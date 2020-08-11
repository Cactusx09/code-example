<template>
    <div class="form-calculation">
        <div class="form-calculation__item has-background-light raises-on-hover animated fadeIn">
            <div class="columns">
                <element-validation class="column is-3"
                    :name="'status_id'"
                    :errors="errors">
                    <vue-select v-model="status.id"
                        :options="status.options"
                        :placeholder="i18n(status.name || 'Stan')"
                        :has-error="errors.has('status_id')"
                        @input="errors.clear('status_id')"/>
                </element-validation>

                <element-validation class="column is-6"
                    :name="'file'"
                    :errors="errors">
                    <uploader v-model="file"
                        ref="fileUploader"
                        api
                        @upload="uploadFile()"
                        @delete="fetch()">
                        <span>
                            {{ i18n('Dodaty harantiynyy lyst') }}
                            <fa class="has-margin-left-medium"
                                icon="upload"/>
                        </span>
                    </uploader>
                </element-validation>

                <div class="column is-narrow ml-auto">
                    <button class="button is-success"
                        @click="save()">
                        {{ i18n('Nadislaty') }}
                    </button>
                </div>
            </div>

            <div class="columns">
                <div class="column is-12">
                    <textarea v-model="message"
                        class="textarea"
                        :placeholder="i18n('Komentar')"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Uploader from '@components/Uploader'
import { VueSelect } from '@enso-ui/select/bulma'

import ElementValidation from '@components/validations/ElementValidation'
import Errors from '@enso-ui/forms/errors'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        Uploader,
        VueSelect,
        ElementValidation,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        params: String,
    },

    data() {
        return {
            status: {
                id: null,
                name: null,
                options: [],
            },
            file: null,
            message: null,

            errors: new Errors(),
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        updateStatusOptions(options) {
            this.status.options = _.uniqBy([...this.status.options, ...options], 'id');
        },

        fetch() {
            axios.get('/api/inwork/contracts/bankExpert/fetchStateData', {
                    params: {
                        insurance_contract_id: this.params,
                    }
                })
                .then(({ data }) => {
                    this.status.name = data.status_name;
                    this.updateStatusOptions(data.status_options);

                    this.$refs.fileUploader.updateOptions(data.guaranteeLetter);
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        save() {
            axios.post(route('inwork.contracts.bankExpert.saveStateData'), {
                    insurance_contract_id: this.params,
                    status_id: this.status.id,
                    message: this.message,
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$emit('submit');

                    this.reset();
                    this.fetch();
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        uploadFile() {
            let formData = this.file;
            formData.append('insurance_contract_id', this.params);

            axios.post('/api/inwork/contracts/bankExpert/uploadGuaranteeLetter', formData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$refs.fileUploader.updateOptions({
                        uploaded: true,
                        file_name: data.file_name,
                        url: data.url,
                        delete_url: data.delete_url,
                    });

                    this.fetch();
                    this.$emit('submit');
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        reset() {
            this.status.id = null;
            this.message = null;
        },
    }
}
</script>

<style lang="sass" scoped>
.form-calculation
    padding: 0
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
    &__item
        padding: 1rem 1.2rem
</style>
