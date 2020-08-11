<template>
    <div class="calculationCard">
        <calculation-card-child :data="data"
            :label="'Kredytni parametry'"/>

        <div class="wizard__buttons buttons">
            <button class="button is-warning ml-auto"
                @click="showCalculationModal = true">
                <span>{{ i18n('Zminyty parametry') }}</span>
            </button>
        </div>

        <calculation-card-child :data="quotedData"
            :label="'Skoryhovani kredytni parametry'"/>

        <form-calculation-card
            :params="contractId"
            class="wizard__form"
            ref="formCalculation"
            @submit="update()"/>

        <calculation-card-modal
            v-if="showCalculationModal"
            :contract-id="contractId"
            :data="data"
            @saved="update()"
            @close="showCalculationModal = false"
        />
    </div>
</template>

<script>
import CalculationCardChild from '@components/cards/calculationCard/CalculationCardChild'
import CardList from '@components/cards/CardList'
import CalculationCardModal from '@components/cards/calculationCard/CalculationCardModal'

import FormCalculationCard from '@components/cards/calculationCard/FormCalculationCard'

import Errors from '@enso-ui/forms/errors'
import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        CalculationCardChild,
        CardList,
        CalculationCardModal,
        FormCalculationCard,
    },

    props: {
        data: {
            type: Object,
        },
        contractId: [String, Number],
    },

    inject: ['i18n'],

    mixins: [errorHandler],


    data() {
        return {
            quotedData: {},
            showCalculationModal: false,
            errors: new Errors(),
        }
    },

    created() {
        this.fetchQuoted();
    },

    methods: {
        update() {
            this.$emit('submit');
            this.fetchQuoted();
        },

        fetchQuoted() {
            axios.get(route('inwork.contracts.bankExpert.getQuotedCalculationCard'), {
                    params: {
                        insurance_contract_id: this.contractId,
                    }
                })
                .then(({ data }) => {
                    if (!!data) {
                        this.quotedData = data;

                        this.$nextTick(() => {
                            this.$refs.formCalculation.updateStatusOptions([data.nextStatus])
                            this.$refs.formCalculation.status.id = data.nextStatus.id;
                        });
                    }
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>

<style lang="sass">
.wizard
    &__columns
        display: flex
        flex-wrap: wrap
    .title
        margin-bottom: 10px
    &__buttons
        margin-top: 1rem
    &__form
        margin-top: 1.5rem
.modal__full
    &_consultation
        .modal-card
            &-head
                font-weight: 700
                .level
                    width: 100%
                    .tags
                        margin-bottom: 0
                        .tag
                            margin-bottom: 0

                    b
                        font-weight: 700
                        font-size: 1.3rem
    .modal
        &-card
            width: calc(100% - 200px)
            max-width: 1600px
            background-color: white
            border-radius: 6px
            box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
            color: #4a4a4a
            &-foot
                justify-content: flex-end
        &-content
            width: 100%
.object_modal
    &.modal-card
        background: red
        &-body
            background: yellow
            form
                background: green
                .columns
                    background: blue
                    &:last-of-type
                        background: black
                        .dropdown-menu
                            bottom: 100%
                            padding-bottom: 4px
                            padding-top: initial
                            top: auto
.consultation__parameters_extraBtns_rate
    display: flex
    align-items: center
    padding: 0 1.5rem
.ml-auto
    margin-left: auto

.calculationCard
    width: 100%
</style>
