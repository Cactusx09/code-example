<template>
    <modal-card
        show
        class="blank_modal"
        @close="$emit('close')"
    >
        <template #header>
            <div class="title is-5">
                {{ i18n(label) }}
            </div>
        </template>

        <template #body>
            <div class="columns">
                <div class="column is-6">
                    <div class="label">{{ i18n('Kompaniya') }}</div>
                    <vue-select
                        v-model="data.insurance_company_id"
                        :source="route('administration.agencies.selectInsuranceCompanies')"
                        :placeholder="i18n('Vyberit kompaniyu')"
                        translated
                    />
                </div>
                <div class="column is-6">
                    <div class="label">{{ i18n('Typ blanku') }}</div>
                    <vue-select
                        v-model="data.blank_type_id"
                        :source="route('administration.policyBlanks.types.options')"
                        :placeholder="i18n('Vyberit typ blanku')"
                        :disabled="['transfer', 'transferByIds'].includes(type)"
                        :i18n="i18n"
                        translated
                    />
                </div>
            </div>

            <div class="columns">
                <div class="column is-6">
                    <div class="label">{{ i18n('Ahentsiya') }}</div>
                    <vue-select
                        v-model="data.agency_id"
                        :source="route('administration.agencies.selectOptions')"
                        :placeholder="i18n('Vyberit ahentsiya')"
                        :i18n="i18n"
                        translated
                    />
                </div>
                <div class="column is-6">
                    <div class="label">{{ i18n('Ahent') }}</div>
                    <vue-select
                        v-model="data.agent_id"
                        :source="route('agents.options')"
                        :pivotParams="agencyId"
                        :placeholder="i18n('Vyberit ahent')"
                        :i18n="i18n"
                        translated
                    />
                </div>
            </div>

            <div class="columns">
                <div class="column is-4">
                    <div class="label">{{ i18n('Seriya') }}</div>
                    <input
                        v-model="data.series"
                        :disabled="['transferByIds'].includes(type)"
                        class="input"
                    >
                </div>
                <div class="column is-4">
                    <div class="label">{{ i18n('Nomer z') }}</div>
                    <input
                        v-model="data.number_from"
                        :disabled="['transferByIds'].includes(type)"
                        type="number"
                        class="input"
                    >
                </div>
                <div class="column is-4">
                    <div class="label">{{ i18n('Nomer po') }}</div>
                    <input
                        v-model="data.number_to"
                        :disabled="['transferByIds'].includes(type)"
                        type="number"
                        class="input"
                    >
                </div>
            </div>
        </template>

        <template #footer>
            <button
                class="button is-success"
                @click="save()">
                {{ i18n('Save') }}
                <span class="is-small has-margin-left-medium">
                    <fa icon="save"/>
                </span>
            </button>
        </template>
    </modal-card>
</template>

<script>
import { ModalCard } from '@enso-ui/modal/bulma';
import { VueSelect } from '@enso-ui/select/bulma';

import errorHandler from '@components/mixins/errorHandler';

export default {
    components: {
        ModalCard,
        VueSelect,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        type: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: null,
        },
        selected: {
            type: Array,
            default: null,
        },
    },

    data() {
        return {
            data: {
                insurance_company_id: null,
                blank_type_id: null,
                agency_id: null,
                agent_id: null,
                series: null,
                number_from: null,
                number_to: null,
            },
        };
    },

    computed: {
        agencyId() {
            const agencyId = this.data.agency_id;

            if (agencyId) {
                return {
                    agency: {
                        id:  agencyId,
                    }
                };
            }

            return null;
        },
    },

    methods: {
        save() {
            const data = { ...this.data };

            if (this.type == 'transferByIds') {
                data.dtRowIds = this.selected;
            }

            axios.post(route(`administration.policyBlanks.${this.type}`), data)
                .then(({ data }) => {
                    this.$toastr.success(`${this.label} proyshlo uspishno`);
                    this.$emit('save');
                    this.$emit('close');
                })
                .catch(error => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>

<style lang="sass">
.blank_modal
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
        overflow: visible
        &-body
            overflow: visible
        &-foot
            justify-content: flex-end
</style>
