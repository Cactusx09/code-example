<template>
    <card v-if="Object.keys(data).length > 0"
        :title="`${i18n(label)} ${data.product_subtype_name.value} ${data.product_code.value} ${data.product_name.value}`"
        :icon="'user'"
        :controls="{ status: data.status_name.value }"
        style="width: 100%">
        <template #content>
            <div class="calculation-card-columns columns is-variable is-0">
                <card-list v-for="(item, key) in data.searchConditions"
                    :key="`searchConditions:${key}`"
                    class="column is-3"
                    :label="item.label"
                    :content="[item.value]"
                    vertical/>
            </div>

            <div class="calculation-card-columns columns is-variable is-0">
                <card-list v-for="(item, key) in data.insuranceLogicVariables"
                    :key="`insuranceLogicVariable:${key}`"
                    :class="[
                        'column is-3', key
                    ]"
                    :label="item.label"
                    :content="[item.value]"
                    vertical>
                    <template v-slot="{ label }">
                        <div v-if="key === 'total_credit_amount'"
                            class="buttons has-addons has-margin-right-large">
                            <div class="button is-primary is-outlined has-text-dark is-static">{{ label }}</div>
                            <div class="button is-primary"><b>{{ item.value | numberFormat(2) }}</b></div>
                        </div>
                    </template>
                </card-list>
            </div>
        </template>
    </card>
</template>

<script>
import Card from '@components/cards/Card'
import CardList from '@components/cards/CardList'

export default {
    components: {
        Card,
        CardList,
    },

    inject: ['i18n'],

    props: {
        data: Object,
        label: String,
    }
}
</script>

<style lang="sass">
.calculation-card
    &-columns
        display: flex
        flex-wrap: wrap
        .total_credit_amount
            margin-left: auto
            font-size: 1.25em
            display: flex
            justify-content: flex-end
            align-items: flex-end
            .buttons
                width: 100%
                .is-outlined
                    pointer-events: none
                .button
                    &:first-of-type
                        margin-left: auto
                    &:last-of-type
                        cursor: default
                        user-select: all
            b
                margin-left: .25em
        .tag
            padding-left: .75em
            width: 100%
</style>
