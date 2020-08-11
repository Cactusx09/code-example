<template>
    <div
        v-show="inited"
        class="extra">
        <div
            v-for="(row, index) in data.rows"
            :key="index"
            class="extra__row">

            <div class="divider">
                <div class="tag">
                    <div
                        v-if="!!row.productRecalcObject"
                        class="title is-6">
                        {{ `${row.productRecalcObject.product_code} - ${row.productRecalcObject.product_name}` }}
                    </div>
                </div>
                <span class="icon has-tooltip has-text-info"
                    v-tooltip="row.productRecalcObject.info || row.productRecalcObject.product_description">
                    <fa icon="info-circle"
                        size="lg"/>
                </span>
            </div>

            <div class="columns">
                <div class="info column is-2-fullhd is-2-widescreen is-4-desktop is-4-tablet is-12-mobile">
                    <div class="info__values">
                        <div
                            v-for="(field, key, index) in row.fields.extra"
                            :key="`${key}_${index}`"
                            class="tag">
                            <span class="label has-text-grey">
                                {{ i18n(field.name) }}
                            </span>
                            <span v-if="!!row.productRecalcObject[key] || Number(row.productRecalcObject[key]) === 0">
                                <span v-if="field.units">
                                    {{ row.productRecalcObject[key] | numberFormat(2) }}
                                    {{ i18n(field.units) }}
                                </span>
                                <span v-else>
                                    {{ row.productRecalcObject[key] }}
                                    {{ row.productRecalcObject[key.substring(0, key.length - '_value'.length) + '_type_name'] }}
                                </span>
                            </span>
                            <span v-else>-</span>
                        </div>
                    </div>

                    <div class="info__total button is-static">
                        <span>{{ i18n(row.fields.total.name) }}</span>
                        <p class="has-text-primary">
                            {{ row.productRecalcObject[row.fields.total.field] | numberFormat(2)}} {{ i18n(row.fields.total.units) }}
                        </p>
                    </div>
                </div>

                <div class="fields column is-10-fullhd is-10-widescreen is-8-desktop is-8-tablet is-12-mobile">
                    <div class="fields__fields columns is-multiline">
                        <div
                            v-for="(field, key, index) in row.fields.recalc"
                            :key="`${key}_${index}`"
                            :class="[
                                'column field',
                                field.column,
                            ]">
                            <label class="label">{{ i18n(field.name) }}</label>
                            <div class="control">
                                <input
                                    v-if="field.meta.type === 'input'"
                                    v-model="row.productRecalcObject.recalc_fields[key]"
                                    type="text"
                                    @input="changed = true"
                                    :disabled="extraParams.disabled"
                                    :class="[
                                        'input',
                                        { 'is-danger': field.required },
                                    ]"/>
                                <vue-select
                                    v-else-if="field.meta.type === 'vueselect'"
                                    v-model="row.productRecalcObject.recalc_fields[key]"
                                    :source="route(field.meta.source)"
                                    @select="changed = true"
                                    @deselect="changed = true"
                                    @clear="changed = true"
                                    :disabled="extraParams.disabled"
                                    :pivot-params="field.meta.pivotParams"
                                    :placeholder="i18n('Oberit')"/>
                                <vue-switch
                                    v-else-if="field.meta.type === 'vueswitch'"
                                    v-model="row.productRecalcObject.recalc_fields[key]"
                                    @input="changed = true"
                                    :disabled="extraParams.disabled"
                                    size="is-large"/>
                            </div>
                        </div>

                        <template v-if="row.productRecalcObject.payment_split_options.length > 0">
                            <div class="column field">
                                <label class="label">{{ i18n('Rozbyvka platezhu') }}</label>
                                <div class="control">
                                    <vue-select
                                        v-model="row.productRecalcObject.recalc_fields.payment_split_id"
                                        @select="changed = true"
                                        :options="row.productRecalcObject.payment_split_options"
                                        :disabled="extraParams.disabled"
                                        :placeholder="i18n('Oberit')"/>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="fields__notes">
                        <div class="column field">
                            <label class="label">{{ i18n(row.fields.footer.notes.name) }}</label>
                            <textarea
                                v-if="row.fields.footer.notes.meta.type = 'textarea'"
                                v-model="row.productRecalcObject.notes"
                                @input="changed = true"
                                :disabled="extraParams.disabled"
                                class="textarea"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-bottom level is-marginless is-size-5">
            <div class="level-left">
                <div
                    v-if="extraParams.parentRow"
                    class="info__total button is-static">
                    <span><b>{{ i18n('Vartist strakhovky') }}</b></span>
                    <p class="has-text-primary">{{ extraParams.parentRow.totalRewardSum | numberFormat(2) }} {{ i18n('hrn') }}</p>
                </div>
            </div>

            <div
                v-if="!extraParams.disabled"
                class="level-right buttons is-marginless has-addons">
                <button
                    v-if="canAccess('inwork.consultations.testInsuranceLogic')"
                    @click="$emit('test-logics', data)"
                    class="button is-marginless is-info">
                    {{ i18n('Protestuvaty') }}
                </button>

                <button
                    :disabled="!changed"
                    @click="changed = false; $emit('recalculate', data)"
                    class="button is-marginless is-info">
                    {{ i18n('Pererakhuvaty') }}
                </button>

                <button
                    :disabled="changed"
                    @click="addConfirmation
                        ? formContractConfirmationModal = true
                        : $emit('add-product', data)"
                    class="button is-marginless is-success">
                    {{ i18n('Obraty') }}
                </button>

                <confirm-modal v-if="addConfirmation"
                    :visible.sync="formContractConfirmationModal"
                    title="Vnesty zminy v rozrakhunky produktu?"
                    @submit="$emit('add-product', data)">
                </confirm-modal>
            </div>
        </div>

        <a @click="$emit('close')"
            class="extra-close is-medium delete">
        </a>
    </div>
</template>

<script>
    import { VTooltip } from 'v-tooltip'

    import { VueSelect } from '@enso-ui/select/bulma'
    import VueSwitch from '@enso-ui/switch/bulma'

    import ConfirmModal from '@components/ConfirmModal'

    import smoothReflow from 'vue-smooth-reflow'

    export default {
        directives: { tooltip: VTooltip },

        components: {
            VueSelect,
            VueSwitch,
            ConfirmModal,
        },

        inject: ['i18n','canAccess'],

        mixins: [smoothReflow],

        props: {
            extraParams: {
                type: Object,
            },
            addConfirmation: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                inited: false,
                showed: false,
                changed: false,
                data: this.extraParams,

                formContractConfirmationModal: false,
            }
        },

        created() {
            this.update();
        },

        mounted() {
            this.$smoothReflow();
        },

        methods: {
            update() {
                this.data = this.extraParams;

                if (!this.extraParams.disabled) {
                    this.changed = false;

                    this.extraParams.rows.forEach((row, index) => {

                        let productObject = {};
                        if (this.extraParams.creditProductFields) {
                            for (let linkedRow of row.productsTable) {
                                productObject = linkedRow.calculations.find((calculation) => calculation.recalculatable_id === row.selectData.value);
                                break;
                            }
                        } else productObject = row.calculations[0];

                        for (const key in row.fields.recalc) {
                            productObject[key] = row.productRecalcObject ? row.productRecalcObject[key] : productObject[key] || null;
                        }
                        productObject.notes = row.productRecalcObject ? row.productRecalcObject.notes : productObject.notes || null;
                        productObject.payment_split_id = row.productRecalcObject ? row.productRecalcObject.payment_split_id : productObject.payment_split_id || null;

                        this.$set(this.data.rows[index], 'productRecalcObject', productObject);
                    });
                }

                if (this.extraParams.creditProductFields) {
                    let creditRecalcObject = this.extraParams.parentRow.calculations[this.extraParams.parentRow.product_rate];

                    const row = this.extraParams.parentRow;

                    for (const key in this.extraParams.creditProductFields.recalc) {
                        creditRecalcObject[key] = row.productRecalcObject ? row.productRecalcObject[key] : creditRecalcObject[key] || null;
                    }
                    creditRecalcObject.notes = row.productRecalcObject ? row.productRecalcObject.notes : creditRecalcObject.notes || null;
                    creditRecalcObject.payment_split_id = row.productRecalcObject ? row.productRecalcObject.payment_split_id : creditRecalcObject.payment_split_id || null;

                    this.data.rows.unshift({
                        fields: this.extraParams.creditProductFields,
                        productRecalcObject: creditRecalcObject,
                    });
                }

                this.inited = true;
            },
        },
    }
</script>

<style lang="sass" scoped>
@import "~bulma/sass/utilities/mixins"

.extra
    position: relative
    margin-bottom: 1rem
    margin-top: 1rem
    box-shadow: inset 0 0 12px -2px rgba(#000, .37)
    border: 2px solid #209cee
    padding: .95rem 1.25rem 1.25rem
    border-radius: 5px
    &__row
        &:not(:last-of-type)
            margin-bottom: 0.5rem
        +mobile
            &:first-of-type
                .divider
                    max-width: calc(100% - 2.5rem)

    .divider
        justify-content: center
        display: flex
        align-items: center
        position: relative
        z-index: 0
        margin-bottom: .9rem
        &:before
            content: ''
            position: absolute
            top: 50%
            left: 0
            width: 100%
            height: 2px
            background-color: whitesmoke
            z-index: -1

        .tag
            width: 500px
            max-width: 100%
            white-space: normal
            text-align: center
            height: auto

        .title
            margin-bottom: 0
        .icon
            margin-left: 0.5rem

    .columns
        margin-bottom: 0

    .info
        display: flex
        flex-direction: column
        &__values
            display: flex
            flex-direction: column
            .tag
                margin-bottom: 0.2rem
                justify-content: space-between
                height: auto
                white-space: normal
                align-items: center
            span
                font-size: .9rem
                white-space: nowrap
                font-weight: 700
                &.label
                    margin-bottom: 0
                    font-weight: 600
                    line-height: 1.3
                    white-space: normal

        &__total
            display: flex
            align-items: center
            padding: 0 .4rem
            margin-top: auto
            font-size: 1em
            height: auto
            justify-content: space-between
            span
                margin-right: .45rem
            p
                font-weight: 700
                letter-spacing: 0.8px
            +mobile
                font-size: 1rem

        &-bottom
            +mobile
                .level-left
                    margin-bottom: 1rem
                .level-right
                    .button
                        flex-grow: 2

    .fields
        &__info
            background-color: #f5f5f5
            padding: 1em 16px
            border-radius: 6px
            font-size: .9rem
            font-weight: 300
            margin-bottom: .7rem
            transition: 2s
            display: flex
            align-items: center
            span
                line-height: 1.4
            i
                color: #209cee
                margin-right: .75em

        &__fields
            margin-bottom: -.5rem

        &__notes
            .field
                padding-left: 0
                padding-right: 0
            .textarea
                min-height: 40px
                padding-top: 3px
                padding-bottom: 3px
        .field:not(:last-child)
            margin-bottom: 0

    &-close
        position: absolute
        right: 1.1625rem
        top: 0.8625rem
        +mobile
            background: #cbcbcb
            right: .7rem
            top: .7rem

</style>
