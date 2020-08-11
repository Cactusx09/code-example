<template>
    <modal-card
        class="seller-agent"
        :show="show"
        @close="$emit('close')">
        <template #header>
            <div>{{ i18n('Ahent-prodavets') }}</div>
        </template>
        <template #body>
            <div class="columns">
                <div class="column is-6">
                    <div class="field">
                        <div class="label">{{ i18n('Nazva ahentsiyi prodavtsya') }}</div>
                        <div class="control">
                            <vue-select
                                v-model="seller_agency_id"
                                :source="route('administration.agencies.selectOptions')"
                                :i18n="i18n"/>
                        </div>
                    </div>
                </div>
                <div class="column is-6">
                    <div class="field">
                        <div class="label">{{ i18n('PIB ahenta prodavtsya') }}</div>
                        <div class="control">
                            <vue-select
                                v-model="seller_agent_id"
                                :source="route('agents.options')"
                                :pivotParams="{
                                    agency: {
                                        id: seller_agency_id,
                                    },
                                }"
                                :i18n="i18n"/>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <button
                class="button button-back is-primary"
                @click="$emit('close')">
                <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                <fa icon="arrow-left" class="has-margin-left-medium"/>
            </button>
            <button
                class="button is-success"
                @click="save()">
                <span class="is-hidden-mobile">{{ i18n('Save') }}</span>
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
    inject: ['i18n'],

    mixins: [errorHandler],

    components: {
        ModalCard,

        VueSelect,
    },

    props: {
        stateId: Number,
        show: Boolean,
        data: Object,
    },

    data() {
        return {
            seller_agency_id: this.data.fields.seller_agency.id,
            seller_agent_id: this.data.fields.seller_agent.id,
        };
    },

    methods: {
        save() {
            axios.patch(`/api/inwork/contracts/questionnaires/sellerAgent/${this.stateId}`,{
                    seller_agent_id: this.seller_agent_id,
                }).then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$emit('saved');
                    this.$emit('close');
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
}
</script>

<style lang="sass">
    .seller-agent
        .button-back
            &.button
                margin-right: auto
        .card-header-title
            b
                font-weight: 700
                margin-left: 1rem
        .modal-card,
        .modal-card-body
            overflow: visible
</style>
