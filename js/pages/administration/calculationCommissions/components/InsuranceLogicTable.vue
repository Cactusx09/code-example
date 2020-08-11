<template>
    <div>
        <div
            v-show="value.length === 0"
            class="columns">
            <div class="column field is-6-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                <u-search
                    :api-url="'/api/dynamicsearch/administration/insuranceLogics/initUTable'"
                    :table-search.sync="keywords"
                    :min-length="3"
                    @accept="accept($event)"
                    @cancel="keywords = null">
                    <div class="control has-icons-left has-icons-right">
                        <u-input
                            v-model="keywords"
                            type="text"
                            placeholder="Oberit strahovu logiku"
                        />
                        <span class="icon is-small is-left">
                            <fa icon="search"/>
                        </span>
                    </div>
                </u-search>
            </div>
        </div>

        <u-table
            v-if="value.length > 0"
            :template="productInsuranceLogicTemplate"
            :table="value"
            @remove-row="visibleInfo = false"
            @update:table="updateValue($event)"
            :scroll="false"
            class="animated">
            <template #actions>
                <button @click="visibleInfo = !visibleInfo"
                    :class="[
                        { 'is-active is-focused': visibleInfo },
                        'button is-small is-table-button is-info',
                    ]">
                    <span class="icon is-small">
                        <fa icon="info"/>
                    </span>
                </button>
            </template>
        </u-table>

        <div v-show="visibleInfo"
            class="text-bounded animated">
            <i><fa icon="info-circle" size="2x"/></i>
            <span v-if="visibleInfo">{{ value[0].description }}</span>
        </div>
    </div>
</template>

<script>

import ProductInsuranceLogic from '@pages/administration/insuranceProducts/templates/ProductInsuranceLogic.js'

import UTable from '@components/UTable'
import USearch from '@components/USearch'
import UInput from '@components/UInput'

export default {
    components: {
        UTable,
        USearch,
        UInput,
    },

    mixins: [ProductInsuranceLogic],

    props: {
        value: {
            type: Array,
            default: null,
        },
    },

    data() {
        return {
            keywords: null,
            visibleInfo: false,
        };
    },

    methods: {
        updateValue(data) {
            this.$emit('input', data);
        },
        accept(data) {
            this.updateValue(data);
            this.keywords = null;
        },
    },
};
</script>

<style lang="sass">
    .text-bounded
        background-color: #dbdbdb
        padding: 1em 16px
        border-radius: 6px
        font-size: .9rem
        font-weight: 300
        margin-bottom: 20px
        margin-top: 20px
        transition: 5s
        display: flex
        align-items: center
        span
            line-height: 1.4
        i
            color: #209cee
            margin-right: .75em
</style>
