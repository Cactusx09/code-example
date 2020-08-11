<template>
    <modal-card :show="show"
        @close="$emit('close')"
        class="editCalc__modal">
        <template #header>
            <div class="level">
                <div class="level-left">
                    <div class="tags has-addons has-margin-right-large">
                        <small class="tag is-medium is-info">{{ data.product_code.value }}</small>
                        <span class="tag is-medium is-primary">{{ data.product_subtype_name.value }}</span>
                    </div>
                    <b>{{ data.product_name.value }}</b>
                </div>

                <div class="level-right has-text-info">
                    {{ data.status_name.value }}
                </div>
            </div>
        </template>

        <template #body>
            <div class="animated fadeIn">
                <div class="title is-5">{{ i18n('Parametry rozrakhovanoho produktu') }}</div>

                <div class="notification">
                    <div class="columns">
                        <card-list v-for="(item, key) in data.searchConditions"
                            :key="`searchConditions:${key}`"
                            class="column is-2"
                            :label="item.label"
                            :content="[
                                item.value,
                            ]"
                            vertical/>
                    </div>
                </div>

                <div class="title is-5">{{ i18n('Rezultat rozrakhunkiv') }}</div>

                <div class="notification">
                    <div class="columns">
                        <card-list v-for="(item, key) in data.insuranceLogicVariables"
                            :key="`insuranceLogicVariables${key}`"
                            class="column is-2"
                            :label="item.label"
                            :content="[
                                item.value,
                            ]"
                            vertical/>
                    </div>
                </div>
                <div class="title is-5 has-margin-top-large">{{ i18n('Oberit inshyy produkt') }}</div>

                <parameters-card :state-id="{
                        id: calculationProductId,
                        name: 'calculation_id',
                    }"
                    :parameters-options="parametersOptions"
                    @saved-params="
                        $emit('save', $event);
                        $emit('close');
                    "/>
            </div>
        </template>
    </modal-card>
</template>

<script>
import ParametersCard from '@components/cards/parameters/ParametersCard'

import CardList from '@components/cards/CardList'
import { ModalCard } from '@enso-ui/modal/bulma'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ParametersCard,
        CardList,
        ModalCard,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        calculationProductId: Number,
    },

    data() {
        return {
            data: {},
            show: false,
            parametersOptions: {
                stateAlias: 'insurance',
                parametersStructure: null,
                // productsData: null,
                apiRoutes: {
                    getForm: {
                        url: 'insuranceprogramparams.getData',
                    },
                    suggestProducts: 'inwork.contracts.suggestProducts',
                    recalculate: 'inwork.contracts.recalculate',
                    saveProductData: 'inwork.contracts.saveCalculationData',
                    testInsuranceLogic: 'inwork.contracts.testInsuranceLogic',
                },
            },
        }
    },

    created() {
        this.getCalculationData();
    },

    methods: {
        getCalculationData() {
            axios.get(route('inwork.contracts.getCalculationData'), {
                    params: {
                        calculation_id: this.calculationProductId,
                    }
                })
                .then(({ data }) => {
                    this.data = data.calculationCard;
                    this.parametersOptions.parametersStructure = data.parametersStructure;
                    this.parametersOptions.alias = this.data.product_subtype_alias;
                    // this.parametersOptions.productsData = data.products;

                    this.show = true;
                    this.$emit('update', data);
                })
                .catch((error) => {
                    this.$emit('close');

                    this.errorHandler(error);
                });
        },
    },
}
</script>

<style lang="sass">
.editCalc
    &__modal
        .columns
            display: flex
            flex-wrap: wrap
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
                &-body
                    .field
                        justify-content: flex-start
                    .vue-select
                        .field
                            flex-direction: row

            &-content
                width: 100%

</style>
