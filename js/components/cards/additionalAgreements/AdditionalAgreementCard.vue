<template>
    <div class="add-agreements-card box has-background-light raises-on-hover">
        <div class="add-agreements-title level title is-5">
            <span><b class="has-text-info">{{ data.type.name }}</b>, {{ i18n('Dodatkova uhoda') }} <b class="has-text-info">{{ data.policy_additional_agreement_code }}</b> {{ i18n('do dohovoru') }} <b class="has-text-info">{{ data.calculation_code }}</b></span>
            <span class="level-right has-text-link">{{ data.status.name }}</span>
        </div>

        <div>
            <clients-wizard
                v-if="data.type.is_affecting_subjects"
                :custom-data="data.clientCards"
                :options="{
                    apiRoutes: options.client.apiRoutes,
                    params: {
                        policy_additional_agreement_id: data.policy_additional_agreement_id,
                        ...options.client.params,
                    },
                }"
                class="card-content-item"
                @saved="$emit('fetch', $event.policy_additional_agreement_id)"
            />

            <insurance-objects-wizard
                v-if="data.type.is_affecting_objects"
                :custom-data="data.insuranceObjectCards"
                :options="{
                    apiRoutes: options.object.apiRoutes,
                    params: {
                        policy_additional_agreement_id: data.policy_additional_agreement_id,
                        ...options.object.params,
                    },
                }"
                class="card-content-item"
                @saved="$emit('fetch', $event.policy_additional_agreement_id)"
            />
        </div>

        <div>
            <div class="columns">
                <element-validation
                    class="field column is-12"
                    :name="'notes'"
                    :errors="errors">
                    <textarea
                        v-model="data.notes"
                        :class="['textarea', { 'is-danger': errors.has('notes') }]"
                        :placeholder="`${i18n('Notes')}`"
                        @input="errors.clear('notes')"/>
                </element-validation>
            </div>

            <div class="columns level">
                <div class="level-left">
                    <div v-if="data.type.is_additional_charge_needed"
                        class="column add-agreements-total">
                        <u-input
                            v-model="data.additional_charge_amount"
                            :type="'number'"
                            :default="0"
                            :min="0"
                            :round="2"
                            placeholder="Suma"
                        />
                    </div>

                    <element-validation
                        class="column is-narrow"
                        :name="'file'"
                        :errors="errors">
                        <uploader
                            v-model="file"
                            ref="fileUploader"
                            api
                            @upload="uploadFile()"
                            @delete="fetch()">
                            <span>
                                {{ i18n('Dodaty dokument') }}
                                <fa class="has-margin-left-medium"
                                    icon="upload"/>
                            </span>
                        </uploader>
                    </element-validation>
                </div>
                <div class="level-right">
                    <div class="buttons column is-narrow">
                        <button class="button is-link"
                            @click="$emit('generate', {
                                policy_additional_agreement_id: data.policy_additional_agreement_id,
                                notes: data.notes,
                                additional_charge_amount: data.additional_charge_amount,
                            })">
                            {{ i18n('Pidhotuvaty dokument') }}
                        </button>

                        <button class="button is-success"
                            @click="$emit('form', {
                                policy_additional_agreement_id: data.policy_additional_agreement_id,
                                policy_additional_agreement_code: data.policy_additional_agreement_code,
                                calculation_code: data.calculation_code,
                                notes: data.notes,
                                additional_charge_amount: data.additional_charge_amount,
                            })">
                            {{ i18n('Sformuvaty') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import ClientsWizard from '@components/cards/clients/ClientsWizard'
    import InsuranceObjectsWizard from '@components/cards/insuranceObjects/InsuranceObjectsWizard'

    import Uploader from '@components/Uploader'
    import UInput from '@components/UInput'

    import ElementValidation from '@components/validations/ElementValidation'
    import Errors from '@enso-ui/forms/errors'

    export default {
        components: {
            ClientsWizard,
            InsuranceObjectsWizard,

            Uploader,
            UInput,
            ElementValidation,
        },

        inject: ['i18n'],

        props: {
            data: {
                type: Object,
                default: null,
            },
            options: {
                type: Object,
                default: null,
            },
        },

        data() {
            return {
                file: null,
                errors: new Errors(),
            }
        },

        mounted() {
            this.$nextTick(this.$refs.fileUploader.updateOptions(this.data.document));
        },

        methods: {
            uploadFile(key) {
                let formData = this.file;
                formData.append('policy_additional_agreement_id', this.data.policy_additional_agreement_id);

                axios.post(route('inwork.contracts.additionalAgreements.uploadDocument'), formData)
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
                        this.$emit('error', error);
                    });
            },
        },
    };

</script>

<style lang="sass">
    .add-agreements
        &-title
            padding-bottom: 0.75rem
            border-bottom: 1px solid #ddd
        &-card
            &:not(:last-of-type)
                margin-bottom: 2.4em
        .textarea
            min-height: 80px
</style>
