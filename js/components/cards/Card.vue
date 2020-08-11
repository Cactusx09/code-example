<template>
    <card
        ref="card"
        class="ins-ui raises-on-hover">
        <card-header>
            <template #title>
                <span class="icon has-margin-right-medium">
                    <fa :icon="icon" size="lg"/>
                </span>
                <span class="card-title">{{ hasFilterTitle }}</span>
            </template>

            <template #controls>
                <slot name="controls"
                    :controls="controls">
                    <div class="level is-flex-mobile">
                        <div v-if="controls.status"
                            class="card-header-status level-item card-header-title media-right has-text-link title is-5 is-marginless">
                            {{ controls.status }}
                        </div>
                        <div v-if="controls.detach"
                            class="card-header-detach level-item has-margin-right-large"
                            @click="$emit('detach')">
                            <span class="icon is-danger button is-radiusless">
                                <fa icon="trash-alt"/>
                            </span>
                        </div>
                        <div v-if="controls.edit"
                            class="card-header-edit level-item"
                            @click="$emit('edit')">
                            <span class="icon is-warning button is-large is-radiusless">
                                <fa icon="pen"/>
                            </span>
                        </div>
                    </div>
                </slot>
            </template>
        </card-header>

        <card-content :class="{ 'card-divider': divider }">
            <slot name="content"></slot>
        </card-content>

        <card-footer v-if="$slots.footer">
            <slot name="footer"
                :controls="controls"/>
        </card-footer>
    </card>
</template>

<script>
    import { library } from '@fortawesome/fontawesome-svg-core'
    import {
        faPen,
        faTrashAlt,
    } from '@fortawesome/free-solid-svg-icons'
    library.add([
        faPen,
        faTrashAlt,
    ])

    import {
        Card,
        CardHeader,
        CardControl,
        CardCollapse,
        CardContent,
        CardBadge,
        CardFooter,
    } from '@enso-ui/card/bulma'

    export default {
        components: {
            Card,
            CardControl,
            CardHeader,
            CardContent,
            CardCollapse,
            CardBadge,
            CardFooter,
        },

        inject: ['i18n'],

        props: {
            title: {
                type: [String, Array],
            },
            controls: {
                type: Object,
                default: () => ({
                    badge: false,
                    add: false,
                    edit: false,
                    detach: false,
                }),
            },
            icon: {
                type: String,
            },
            divider: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            hasFilterTitle() {
                return this.title instanceof Array ?
                    this.title.map((title) => this.i18n(title)).join(' ') :
                    this.i18n(this.title);
            }
        },
    }
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"

$border: 1px solid #ddd

.ins-ui
    .card
        &-header
            .card-header-title
                padding-top: .5rem
                padding-bottom: .5rem
                font-size: 1.15rem
                +mobile
                    white-space: normal
                    font-size: 0.94rem
                    line-height: 1.15
                    >.icon
                        font-size: 0.9rem
                        margin-left: -5px
            +mobile
                .level-item.has-margin-right-large
                    margin-bottom: 0
                .button.is-danger
                    height: 2rem
                    width: 2rem
        &-divider
            position: relative
            &:before
                content: ''
                position: absolute
                right: 0
                top: 0
                height: 100%
                z-index: 0
                border-left: $border
                width: calc(75% - 8px)
                // FIXME: divider should working with responsive columns in CardList.vue
                +tablet-only
                    width: calc(83% - 8px)
                +mobile
                    display: none
</style>
