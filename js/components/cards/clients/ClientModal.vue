<template>
    <div>
        <modal-card
            :show="visible"
            class="client_modal"
            @close="
                updateClientParams({
                    url: apiRoutes.getStructure,
                    params: options.params,
                }, false);
                currentForm.client_snapshot_id = null;
            ">

            <template #header>
                <div class="tile is-vertical">
                    <div class="title is-5">
                        {{ i18n('Kliyent') }}
                    </div>

                    <card-old-data v-if="!!oldData" :data="oldData"/>
                </div>
            </template>

            <template #body>
                <enso-tabs
                    fullwidth
                    @activated="selectTab($event)"
                    ref="tabs">
                    <tab :id="i18n('Kliyent')">
                        <vue-form
                            :path="route(currentForm.url)"
                            :params="currentForm.params"
                            ref="client"
                            :i18n="i18n"
                            :locale="$store.getters['preferences/lang']"
                            @ready="ready()"
                            @loaded="$refs.client.field('client_person_type_id').value = $refs.client.field('client_person_type_id').value || currentForm.client_person_type_id">

                            <template #client_person_type_id="props">
                                <form-field
                                    v-bind="props"
                                    @select="
                                        updateClientParams({
                                            client_person_type_id: $event,
                                            url: apiRoutes.getStructure,
                                            params: {
                                                client_person_type_id: $event,
                                            },
                                        }, true);
                                    "/>
                            </template>

                            <template #client_phone="props">
                                <label class="label">{{ i18n(props.field.label) }}</label>
                                <u-search
                                    :route="'client'"
                                    :table-filters="tableFilters[props.field.name]"
                                    :min-length="3"
                                    @accept="
                                        updateClientParams({
                                            url: apiRoutes.getById,
                                            params: {
                                                client_id: $event[0].dtRowId,
                                            },
                                        }, true);
                                        currentForm.client_snapshot_id = $refs.client.field('client_snapshot_id').value;
                                        currentForm.client_role_ids = $refs.client.field('client_role_ids').value;
                                    ">
                                    <input-phone
                                        v-bind="props"
                                        @input="debounceSearch(() => {
                                            tableFilters[props.field.name] = {
                                                client_phones: {
                                                    client_phone: $event,
                                                },
                                                clients: {
                                                    client_person_type_id: $refs.client.field('client_person_type_id').value,
                                                }
                                            }
                                        })"/>
                                </u-search>
                            </template>

                            <template #company_edrpou="props">
                                <u-search
                                    :route="'client'"
                                    :table-filters="tableFilters[props.field.name]"
                                    :min-length="3"
                                    @accept="
                                        updateClientParams({
                                            url: apiRoutes.getById,
                                            params: {
                                                client_id: $event[0].dtRowId,
                                            },
                                        }, true);
                                        currentForm.client_snapshot_id = $refs.client.field('client_snapshot_id').value;
                                        currentForm.client_role_ids = $refs.client.field('client_role_ids').value;
                                    ">
                                    <form-field
                                        v-bind="props"
                                        @changed="debounceSearch(() => {
                                            tableFilters[props.field.name] = {
                                                companies: {
                                                    company_edrpou: $event,
                                                }
                                            }
                                        })"
                                    />
                                </u-search>
                            </template>

                            <template #client_ipn="props">
                                <u-search
                                    :route="'client'"
                                    :table-filters="tableFilters[props.field.name]"
                                    :min-length="3"
                                    @accept="
                                        updateClientParams({
                                            url: apiRoutes.getById,
                                            params: {
                                                client_id: $event[0].dtRowId,
                                            },
                                        }, true);
                                        currentForm.client_snapshot_id = $refs.client.field('client_snapshot_id').value;
                                        currentForm.client_role_ids = $refs.client.field('client_role_ids').value;
                                    ">
                                    <form-field
                                        v-bind="props"
                                        @changed="debounceSearch(() => {
                                            tableFilters[props.field.name] = {
                                                clients: {
                                                    client_ipn: props.field.value,
                                                }
                                            }
                                        })"
                                    />
                                </u-search>
                            </template>

                            <template #client_phone_residence="props">
                                <label class="label">{{ i18n(props.field.label) }}</label>
                                <input-phone v-bind="props"/>
                            </template>
                            <template #client_phone_registration="props">
                                <label class="label">{{ i18n(props.field.label) }}</label>
                                <input-phone v-bind="props"/>
                            </template>

                            <template #client_previous_lastname="props">
                                <form-field
                                    v-bind="props"
                                    v-if="$refs.client.field('is_changed_last_name').value"/>
                            </template>

                            <template #client_registries_region_id="props">
                                <form-field
                                    v-bind="props"
                                    @input="$refs.client.field('client_registries_city_id').meta.params.region_id = $event"/>
                            </template>
                            <template #client_registries_other_city="props">
                                <form-field
                                    v-bind="props"
                                    @input="changeOtherCity('registries', $event)"
                                />
                            </template>
                            <template #client_registries_city_id="props">
                                <form-field
                                    v-bind="props"
                                    :params="props.field.meta.params"/>
                            </template>

                            <template #actual_equal_registries="props">
                                <form-field
                                    v-bind="props"
                                    @input="registriesToActualAdressCopy($event)"/>
                            </template>

                            <template #client_actual_region_id="props">
                                <form-field
                                    v-bind="props"
                                    @input="$refs.client.field('client_actual_city_id').meta.params.region_id = $event"/>
                            </template>
                            <template #client_actual_other_city="props">
                                <form-field
                                    v-bind="props"
                                    @input="changeOtherCity('actual', $event)"
                                />
                            </template>
                            <template #client_actual_city_id="props">
                                <form-field
                                    v-bind="props"
                                    :params="props.field.meta.params"/>
                            </template>

                            <template #is_client_id_card="props">
                                <form-field
                                    v-bind="props"
                                    @input="isClientIdCard = $event"
                                />
                            </template>

                            <template
                                v-if="isClientIdCard"
                                #client_id_card="props">
                                <form-section v-bind="props"/>
                            </template>

                            <template
                                v-else
                                #client_passport="props">
                                <form-section v-bind="props"/>
                            </template>

                            <template #marital_status_id="props">
                                <form-field
                                    v-bind="props"
                                    @input="isMarried($event)"
                                />
                            </template>

                            <template #is_second_signature="props">
                                <form-field
                                    v-bind="props"
                                    @input="isSecondSignature($event)"
                                />
                            </template>
                        </vue-form>
                    </tab>
                    <tab
                        :id="i18n('Finansove stanovyshche')"
                        v-if="financialSituation && currentForm.client_snapshot_id">
                        <financial-situation
                            :contract-id="$route.params.contract"
                            :contract-created-at="contractCreatedAt"
                            :client-snapshot-id="currentForm.client_snapshot_id"
                            ref="financialSituation"/>
                    </tab>
                </enso-tabs>
            </template>

            <template #footer>
                <button
                    v-if="options.params.stateAlias === 'consultation' && !!currentForm.client_snapshot_id"
                    @click="detachClient()"
                    class="button is-danger is-small">
                    {{ i18n('Vidkripyty') }}
                    <span class="is-small has-margin-left-medium">
                        <fa icon="trash-alt" />
                    </span>
                </button>
                <button
                    class="button is-success"
                    @click="
                        $refs.financialSituation
                            ? $refs.financialSituation.saveFinancialSituation()
                            : saveClient()
                    ">
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
import { EnsoForm, VueForm, FormField } from '@enso-ui/forms/bulma'
import FormSection from '@enso-ui/forms/src/bulma/parts/FormSection'
import InputPhone from '@components/vueforms/InputPhone'
import USearch from '@components/USearch'

import FinancialSituation from '@components/cards/clients/FinancialSituation'
import { Tab, EnsoTabs } from '@enso-ui/tabs/bulma'

import CardOldData from '@components/cards/CardOldData'

import errorHandler from '@components/mixins/errorHandler'
import dropdownPosition from '@components/mixins/dropdownPosition'

export default {
    components: {
        ModalCard,
        ConfirmModal,
        EnsoForm,
        VueForm,
        FormField,
        FormSection,
        InputPhone,
        USearch,

        FinancialSituation,
        Tab,
        EnsoTabs,

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
        financialSituation: {
            type: Boolean,
        },
        oldData: {
            type: Object,
        },
        contractCreatedAt: {
            type: String,
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
                client_phone: null,
                contact_phone: null,
                client_ipn: null,
                company_edrpou: null,
            },
            activeTab: null,
            isClientIdCard: false,

            detachConfirmModal: false,
        };
    },

    methods: {
        ready() {
            this.readyAddressFields('registries');
            this.readyAddressFields('actual');

            if (this.$refs.client.field('is_changed_last_name'))
                this.$refs.client.field('is_changed_last_name').value = !!this.$refs.client.field('client_previous_lastname').value;

            if (this.$refs.client.field('is_client_id_card'))
                this.isClientIdCard = this.$refs.client.field('is_client_id_card').value;

            if (this.$refs.client.field('marital_status_id'))
                this.isMarried(this.$refs.client.field('marital_status_id').value);

            if (this.$refs.client.field('is_second_signature'))
                this.isSecondSignature(this.$refs.client.field('is_second_signature').value);

            if (this.currentForm.client_role_ids) {
                this.$refs.client.field('client_role_ids').value = this.currentForm.client_role_ids;
                delete this.currentForm.client_role_ids;
            }

            this.$nextTick(() => this.addEventListenersInContainer(document.querySelector('.modal-card-body')));
        },
        updateClientParams(form, visible) {
            this.currentForm = form;
            this.visible = visible;

            if (visible && this.$refs.client) this.$nextTick(() => this.$refs.client.fetch());
        },
        saveClient() {
            let fields = this.$refs.client.formData;

            if (this.currentForm.client_snapshot_id) fields.client_snapshot_id = this.currentForm.client_snapshot_id;

            axios.post(
                    route(this.apiRoutes.save),
                    { ...fields, ...this.options.params }
                )
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.updateClientParams(this.apiRoutes.getStructure, false);

                    this.visible = false;

                    this.$nextTick(() => this.$emit('saved', data));
                })
                .catch((error) => {
                    this.errorHandler(error, { refForm: this.$refs.client });
                });
        },
        detachClient(snapshot_id) {
            this.detachConfirmModal = snapshot_id;
        },
        confirmDetach() {
            axios.post(
                    route(this.apiRoutes.detach),
                    {
                        consultation_id: this.options.params.consultation_id,
                        snapshot_id: this.currentForm.client_snapshot_id || this.detachConfirmModal,
                    },
                )
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    // this.updateClientParams(this.apiRoutes.getStructure, false);

                    this.visible = false;

                    this.$nextTick(() => this.$emit('detached', data));
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        registriesToActualAdressCopy(checkedEqual) {
            const fieldNamesSuffix = [
                'region_id',
                'district',
                'other_city',
                'city_id',
                'city_displayname',
                'street_type_id',
                'street',
                'house',
                'flat',
            ];

            fieldNamesSuffix.forEach((suffix) => {
                this.$refs.client.field(`client_actual_${suffix}`).value = checkedEqual ? this.$refs.client.field(`client_registries_${suffix}`).value : null;
                this.$refs.client.field(`client_actual_${suffix}`).meta.disabled = checkedEqual;
            });

            this.changeOtherCity('actual', this.$refs.client.field('client_actual_other_city').value);
        },
        readyAddressFields(name) {
            const fieldCityId = this.$refs.client.field(`client_${name}_city_id`);

            if (fieldCityId) {
                fieldCityId.meta.params.region_id = this.$refs.client.field(`client_${name}_region_id`).value;

                if (!fieldCityId.value && this.$refs.client.field(`client_${name}_city_displayname`).value) {
                    this.$refs.client.field(`client_${name}_other_city`).value = true;
                    this.changeOtherCity(name, true);
                } else {
                    this.$refs.client.field(`client_${name}_city_displayname`).value = null;
                }
            }
        },
        changeOtherCity(name, value) {
            this.$refs.client.field(`client_${name}_city_id`).meta.hidden = value;
            this.$refs.client.field(`client_${name}_city_displayname`).meta.hidden = !value;

            this.$refs.client.field(`client_${name}_city_${value ? 'id' : 'displayname'}`).value = null;
        },
        isMarried(maritalStatusId) {
            this.$refs.client.field('marital_registration_date').meta.hidden = maritalStatusId !== 1;
            this.$refs.client.field('is_marital_working').meta.hidden = maritalStatusId !== 1;
        },
        isSecondSignature(flag) {
            this.$refs.client.field('second_signature_lastname').meta.hidden = !flag;
            this.$refs.client.field('second_signature_firstname').meta.hidden = !flag;
            this.$refs.client.field('second_signature_surname').meta.hidden = !flag;
            this.$refs.client.field('second_signature_position').meta.hidden = !flag;
            this.$refs.client.field('second_signature_basis').meta.hidden = !flag;
        },
        selectTab(event) {
            this.activeTab = event;

            if (!this.financialSituation) {
                document.querySelector('.client_modal .tabs').className += ' is-hidden';
            }
        },
        debounceSearch: _.debounce(function (method) {
            return method();
        }, 1000),
    }
}
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"

.client_modal
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
        &-foot
            justify-content: flex-end
    .field
        &:not(:last-of-type)
            margin-bottom: 0
    .u-search
        .input
            background: #ffdd5733
    .modal-card-head
        .message
            margin-top: -1rem
</style>
