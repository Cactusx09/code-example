<template>
    <div>
        <slot name="title" :label="`${i18n('Dokumenty')} (${body.length})`"></slot>

        <slot name="body">
            <div class="tl_body">
                <div v-for="(file, key) in body"
                    :key="`message_file:${key}`"
                    :class="[
                        'tl_body__file',
                        { 'hidden': !visible && key > 2 },
                        { 'deleted': file.deleted_at },
                    ]">
                    <div class="tl_body__file-head">
                        <span class="icon has-margin-right-small">
                            <fa v-if="file.deleted_at"
                                class="fa-lg"
                                icon="times"/>

                            <fa v-else
                                class="fa-lg"
                                :icon="file.mime_type.split('/')[0] === 'image' ? 'file-image' : 'file-pdf'"/>
                        </span>

                        <p>
                            {{ file.name }}
                        </p>

                        <span v-if="file.created_at"
                            class="tl_date tag is-small is-light">
                            {{ file.created_at }}
                        </span>

                        <div class="buttons has-addons">
                            <button
                                :class="['button is-small', { 'has-text-info': descriptions[key] }]"
                                :disabled="!file.description || file.description === 'null'"
                                @click="descriptions[key] = !descriptions[key]">
                                <span class="icon"><fa icon="info"/></span>
                            </button>

                            <button class="button is-small"
                                @click.stop="show = true">
                                <span class="icon"><fa icon="eye"/></span>
                            </button>

                            <a class="button is-small has-text-dark"
                                :href="file.url"
                                :download="file.name"
                                target="_blanc">
                                <span class="icon"><fa icon="download"/></span>
                            </a>
                        </div>
                    </div>

                    <div v-if="descriptions[key]"
                        class="tl_body__file-body message is-small">
                        <strong>
                            {{ file.description }}
                        </strong>
                    </div>
                </div>
            </div>

            <div v-if="body.length > 3"
                class="tl_body__more">
                <div @click="visible = !visible">
                    <p>
                        {{ visible ? i18n('Men\'she') : i18n('Bil\'she') }}
                    </p>

                    <span class="icon">
                        <fa icon="angle-down"
                            :style="{ transform: visible ? 'rotate(180deg)' : 'none' }"/>
                    </span>
                </div>
            </div>
        </slot>

        <modal class="modal-gallery"
            :show="show"
            @close="show = false">
            <gallery :dataItems="body"
                class="box"
                ref="photoGallery">
                <div class="columns gallery__head">
                    <div class="column is-10-fullhd is-10-widescreen is-9-desktop is-6-tablet is-12-mobile">
                        <!-- <div class="title is-5">{{dataMessages[popup.current].body.topic}}</div> -->
                        <!-- <div class="subtitle is-6 time">
                            {{dateFormat(dataMessages[popup.current].created_at)}} о {{ timeFormat(dataMessages[popup.current].created_at) }}</div> -->
                    </div>
                    <div class="column is-2-fullhd is-2-widescreen is-3-desktop is-6-tablet is-12-mobile">
                        <span class="has-text-dark buttons">
                            <!--<a :href="`/api/inwork/contracts/documents/downloadZipFiles?model_id=${data.resource.id}`"
                                :download="`${i18n('Dokumenty')}.zip`"
                                :title="i18n('Zahruzyty vsi dokumenty v zip')"
                                target="_blank"
                                class="button is-fullwidth ">
                                <span class="icon is-medium ">
                                    <fa class="fa" icon="download" />
                                </span>
                                <span>{{i18n('Zberehty vsi')}}</span>
                            </a>-->
                        </span>
                    </div>
                </div>
            </gallery>
        </modal>
    </div>
</template>

<script>
import { Modal } from '@enso-ui/modal/bulma'
import Gallery from '@components/Gallery'

import SmoothReflow from 'vue-smooth-reflow'

export default {
    components: {
        Modal,
        Gallery,
    },

    mixins: [SmoothReflow],

    inject: ['i18n'],

    props: {
        body: Array,
        condition: String,
    },

    data() {
        return {
            show: false,
            visible: false,
            descriptions: {},
        }
    },

    created() {
        Array.from({ length: this.body.length }, (el, key) => {
            this.$set(this.descriptions, key, false);
        });
    },

    mounted() {
        this.$smoothReflow();
    },
}
</script>

<style lang="sass" scoped>
.tl_title
    margin-bottom: 0
.tl_body
    margin-top: 0 !important
    position: relative
    &__file
        border-bottom: 1px solid #ddd
        display: flex
        flex-direction: column
        cursor: default
        transition: .1s
        &-head
            display: flex
            padding: .25em .75em
            .buttons
                align-items: flex-start
                flex-wrap: nowrap
            p
                margin-right: 10px
                word-break: break-all
            .wrapper
                display: inline
                white-space: pre-wrap
                word-break: break-all
                height: auto
                text-align: left
                p
                    display: inline
                    line-height: 1.7
                .tag
                    float: right
                    margin-left: 5px
        &-body
            padding: .25em .75em
            margin: .5rem
        .tl_date
            margin-left: auto
            margin-right: 10px
        &:hover
            box-shadow: 0 6px 10px -4px rgba(137, 135, 135, 0.2)
        &.hidden
            display: none
        &.deleted
            opacity: .6
            background: rgba(221, 221, 221, 0.5)
            pointer-events: none
    &__more
        display: flex
        justify-content: center
        & > div
            display: flex
            cursor: pointer
            svg
                transition: .3s
</style>
