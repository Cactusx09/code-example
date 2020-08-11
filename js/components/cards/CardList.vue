<template>
    <div v-if="filtered.length > 0"
        :class="['card-lists', vertical ? 'vertical' : 'columns']">
        <slot :label="i18n(label)">
            <div :class="[{ 'card-lists-label column has-text-right': !vertical }, columnsSize.left]">
                <label class="label">{{ i18n(label) }}</label>
            </div>
            <div :class="vertical ? 'vertical has-margin-right-large' : `card-lists-content column ${columnsSize.right}`">
                <div v-for="(item, index) in filtered" :key="`${item}-${index}`"
                    class="card-lists-cell">
                    {{ item }}
                </div>
            </div>
        </slot>
    </div>
</template>

<script>
export default {
    inject: ['i18n'],

    props: {
        label: {
            type: String,
        },
        content: {
            type: Array,
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        columnsSize: {
            type: Object,
            default: () => ({
                left: 'is-3-fullhd is-3-widescreen is-3-desktop is-2-tablet',
                right: 'is-9-fullhd is-9-widescreen is-9-desktop is-10-tablet',
            }),
        },
    },

    computed: {
        filtered() {
            return this.content.filter(content => content);
        },
    },
}
</script>

<style lang="sass" scoped>
@import "~bulma/sass/utilities/mixins"

$text: #292929
$border: 1px solid #ddd

.card-lists
    &.columns
        margin: 0
        padding-top: .25rem
        &:not(:last-of-type)
            .card-lists-content
                border-bottom: $border
                +mobile
                    border-bottom: none
            +mobile
                border-bottom: $border
        +mobile
            display: block
            padding-bottom: 0.35rem
            .column
                flex: none
    &-label
        display: flex
        justify-content: flex-end
        padding: 0
        padding-right: 1rem
        +mobile
            display: inline
            padding-right: 0.5rem
        .label
            margin-top: .15rem
            color: $text
            &:after
                content: ':'
            +mobile
                display: inline
    &-content
        z-index: 9
        padding: 0
        padding-bottom: .2vw
        padding-left: 1rem
        +mobile
            padding-left: 0
            padding-bottom: 0.35rem
            max-width: 100%
            display: inline
    &-cell
        display: inline-block
        margin-right: .5rem
        font-weight: 500
        color: $text
.vertical
    padding-top: 0.5rem
    .tag
        height: auto
        white-space: normal
        padding-left: 0
        font-size: .9rem
</style>
