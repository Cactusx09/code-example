<template>
    <div class="add-agreements">
        <div class="add-agreements-create">
            <button class="button is-success"
                @click="modals.create = true">
                {{ i18n('Stvoryty dodatkovu uhodu') }}
            </button>
        </div>

        <create-additional-agreement-modal v-if="modals.create"
            :contractId="contractId"
            @fetch="fetch($event)"
            @close="modals.create = false"/>

        <div v-if="data.length > 0">
            <additional-agreement-card
                v-for="item in data"
                :key="item.policy_additional_agreement_id"
                :data="item"
                :options="options"
                @fetch="fetch($event)"
                @form="
                    currentData = $event;
                    modals.form = true;
                "
                @generate="
                    currentData = $event;
                    modals.generate = true;
                "
                @error="errorHandler($event)"/>

            <modal :show="modals.generate"
                class="confirmation_modal"
                @close="modals.generate = false">
                <div class="box">
                    <p>{{ i18n('Pereydit na vkladku formy dlya druku ta vidredahuyte neobkhidnyy dokument') }}</p>

                    <button class="button button-confirmation is-success"
                        @click="
                            modals.generate = false;
                            generatePrintingForms();
                        ">
                        <span class="is-hidden-mobile">{{ i18n('Ок') }}</span>
                    </button>
                </div>
            </modal>

            <confirm-modal :visible.sync="modals.form"
                @submit="form()"
                class="confirmation_modal">
                <template #header>
                    <p v-if="currentData.policy_additional_agreement_code">
                        {{ i18n('Vy vpevneni shcho dokumenty pidhotovleno i vy bazhayete sformuvaty dodatkovu uhodu') }} <b>{{ currentData.policy_additional_agreement_code }}</b> {{ i18n('do dohovoru') }} <b>{{ currentData.calculation_code }}</b>
                    </p>
                </template>
            </confirm-modal>
        </div>
    </div>
</template>

<script>

    import AdditionalAgreementCard from '@components/cards/additionalAgreements/AdditionalAgreementCard'
    import CreateAdditionalAgreementModal from '@components/cards/additionalAgreements/CreateAdditionalAgreementModal'

    import { Modal } from '@enso-ui/modal/bulma'

    import ConfirmModal from '@components/ConfirmModal'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            AdditionalAgreementCard,
            CreateAdditionalAgreementModal,
            Modal,
            ConfirmModal,
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        props: {
            options: {
                type: Object,
            },
        },

        data() {
            return {
                contractId: this.$route.params.contract,
                data: [],
                currentData: {},
                modals: {
                    create: false,
                    generate: false,
                    form: false,
                },
            }
        },

        created() {
            this.fetch();
        },

        methods: {
            fetch(policyAdditionalAgreementId) {
                let params = {
                    insurance_contract_id: this.contractId,
                }

                if (policyAdditionalAgreementId) {
                    params = {
                        ...params,
                        policy_additional_agreement_ids: [policyAdditionalAgreementId],
                    }
                }

                axios.get(route('inwork.contracts.additionalAgreements.fetch'), { params })
                    .then(({ data }) => {
                        if (!data.data) {
                            return;
                        }

                        if (policyAdditionalAgreementId) {
                            let index = this.data.findIndex((item) => item.policy_additional_agreement_id === policyAdditionalAgreementId);

                            if (index > -1) {
                                this.data.splice(index, 1, data.data[0]);
                            } else {
                                this.data = [...data.data, ...this.data]
                            }

                            return;
                        }

                        this.data = data.data;
                    });
            },
            form() {
                axios.post(route('inwork.contracts.additionalAgreements.form'), this.currentData)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);

                        this.fetch(data.policy_additional_agreement_id);

                        this.$store.dispatch('wizard/setSelectedSections', { whiteList: ['calculations'] });
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
            generatePrintingForms() {
                axios.post(route('inwork.contracts.additionalAgreements.generatePrintingForms'), this.currentData)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);

                        this.$router.push({ name: 'inwork.contracts.edit.printForm' })
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
        },
    };

</script>

<style lang="sass">
.confirmation_modal
    .box
        width: 100%
        display: flex
        flex-direction: column
        align-items: center
        .button-confirmation
            margin-top: 1em

.add-agreements
    &-header,
    &-block
        position: relative
        border-bottom: 1px solid #ddd
    &-create
        padding-bottom: 2em
    &-header
        display: flex
        justify-content: space-between
        padding-bottom: 1em
        .level-left
            flex-direction: column
            align-items: end
    &-block
        padding: 1rem 0
        &:last-of-type
            border: none
        .level
            margin-top: -.5em
            padding-bottom: .5em
            .title
                margin-bottom: 0
</style>
