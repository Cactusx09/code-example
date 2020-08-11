<template>
    <div :class="[
            'timeline__block',
            message.condition === 'author' ? 'left' : 'right',
            { unread: message.condition === 'unread' },
        ]">
        <span
            v-if="selected"
            :class="[
                'tl_marker button icon has-text-white',
                { 'is-success': checked },
            ]"
            @click="
                checked = !checked;
                $emit('selected');
            ">
            <fa :style="{ opacity: checked ? 1 : 0 }" icon="check"/>
        </span>

        <span
            v-else
            :class="[
                'tl_marker button icon',
                markers[message.type].class,
            ]">
            <fa :icon="markers[message.type].faIcon"/>
        </span>

        <div class="timeline__card">
            <span class="tl_time tag has-text-dark">
                {{ message.time }}
            </span>

            <div class="tl_left has-background-light">
                <h1
                    v-if="message.author.display_name"
                    class="title is-6">
                    <strong>{{ message.author.display_name }}</strong>
                </h1>
                <div
                    v-if="message.author.position"
                    class="subtitle is-6">
                    {{ message.author.position }}
                </div>

                <a
                    v-for="link in ['phone', 'email']"
                    :key="`${link}`"
                    class="tl_conect has-text-link">
                    <span
                        v-if="message.author[link]"
                        class="icon has-margin-right-small">
                        <fa :icon="link === 'phone' ? 'phone' : 'at'"/>
                    </span>
                    {{ message.author[link] }}
                </a>

                <div
                    v-if="[...message.forwarded_to.mailingGroups, ...message.forwarded_to.users].length > 0"
                    class="tl_forwarded">
                    <span
                        v-for="(group, index) in message.forwarded_to.mailingGroups"
                        :key="`group:${group.id}(${index})`"
                        class="tag is-primary">
                        <span class="tag_name">
                            <span class="icon has-text-white has-margin-right-small">
                                <fa icon="users"/>
                            </span>
                            {{ group.name }}
                        </span>
                    </span>

                    <span
                        v-for="(user, index) in message.forwarded_to.users"
                        :key="`user:${user.id}(${index})`"
                        class="tag is-dark">
                        <span class="tag_name">
                            <span class="icon has-text-white has-margin-right-small">
                                <fa icon="user"/>
                            </span>
                            {{ user.display_name }}
                        </span>
                        <span
                            class="icon has-text-info tag_info"
                            v-tooltip.right="{
                                content: `${ user.email ? `<span class='tag_tooltip tag is-white' style='padding: 0;'><span>${user.position}</span></span></br> ` : '' }
                                    ${ user.email ? `<span class='tag_tooltip tag is-white has-text-link' style='padding: 0; margin-top: -5px;'>${infoIcon.email}<span>${user.email}</span></span></br>` : '' }
                                    ${ user.phone ? `<span class='tag_tooltip tag is-white has-text-link' style='padding: 0; margin-top: -5px;'>${infoIcon.phone}<span>${user.phone}</span></span>` : '' }`,
                            }">
                            <span><fa class="fa-lg" icon="info-circle"/></span>
                        </span>
                    </span>
                </div>
            </div>

            <component
                :is="`Type${message.type.charAt(0).toUpperCase()}${message.type.substr(1)}`"
                :body="message.body"
                :condition="message.condition"
                class="tl_right"
                @condition="$emit('condition')">
                <template #title="{ label }">
                    <h2 class="tl_title">
                        <strong>{{ message.body.topic || label }}</strong>
                    </h2>
                </template>

                <template #body>
                    <a
                        v-if="message.condition === 'unread'"
                        class="tl_condition"
                        @click="$emit('condition')">
                        {{ i18n('Perehlyanuty povidomlennya...') }}
                    </a>
                </template>
            </component>
        </div>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    //icons Buttons center Timeline
    faEnvelope,
    faPencilAlt,
    faFile,
    faBell,
    faCheck,
    //icons Card info
    faAt,
    faPhone,
    faUser,
    faUsers,
    //icons File
    faEye,
    faFileDownload,
    faCalendarAlt,
    faCalendarTimes,

    faInfoCircle,
    faBookmark,

    faAngleDown,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'


library.add([faEnvelope, faPencilAlt, faFile, faBell, faCheck, faAt, faPhone, faUser, faUsers, faEye, faFileDownload, faCalendarAlt, faCalendarTimes, faInfoCircle, faBookmark, faAngleDown, faTimes])

const icons = {
    email: '<span class="icon has-text-link has-margin-right-large"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="at" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-at fa-w-16"><path fill="currentColor" d="M256 8C118.941 8 8 118.919 8 256c0 137.059 110.919 248 248 248 48.154 0 95.342-14.14 135.408-40.223 12.005-7.815 14.625-24.288 5.552-35.372l-10.177-12.433c-7.671-9.371-21.179-11.667-31.373-5.129C325.92 429.757 291.314 440 256 440c-101.458 0-184-82.542-184-184S154.542 72 256 72c100.139 0 184 57.619 184 160 0 38.786-21.093 79.742-58.17 83.693-17.349-.454-16.91-12.857-13.476-30.024l23.433-121.11C394.653 149.75 383.308 136 368.225 136h-44.981a13.518 13.518 0 0 0-13.432 11.993l-.01.092c-14.697-17.901-40.448-21.775-59.971-21.775-74.58 0-137.831 62.234-137.831 151.46 0 65.303 36.785 105.87 96 105.87 26.984 0 57.369-15.637 74.991-38.333 9.522 34.104 40.613 34.103 70.71 34.103C462.609 379.41 504 307.798 504 232 504 95.653 394.023 8 256 8zm-21.68 304.43c-22.249 0-36.07-15.623-36.07-40.771 0-44.993 30.779-72.729 58.63-72.729 22.292 0 35.601 15.241 35.601 40.77 0 45.061-33.875 72.73-58.161 72.73z" class=""></path></svg></span>',
    phone: '<span class="icon has-text-link has-margin-right-large"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-phone fa-w-16"><path fill="currentColor" d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" class=""></path></svg></span>',
}

import TypeText from './Type/Text'
import TypeFile from './Type/File'
import TypeCalculationStatusChange from './Type/CalculationStatusChange'

export default {
    components: {
        TypeFile,
        TypeCalculationStatusChange,
        TypeText,
    },

    directives: {
        tooltip: VTooltip,
    },

    inject: ['i18n'],

    props: {
        message: {
            type: Object,
            default: null,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            infoIcon: icons,
            checked: false,
            markers: {
                text: {
                    faIcon: 'envelope',
                    class: 'is-info has-text-white',
                },
                file: {
                    faIcon: 'file',
                    class: 'is-primary has-text-white',
                },
                calculationStatusChange: {
                    faIcon: 'bell',
                    class: 'is-warning has-text-white',
                },
            },
        };
    },
};
</script>

<style lang="sass">
.timeline
    &__block
        display: flex
        position: relative
        width: 50%
        &:before
            content: ""
            background-color: #dbdbdb
            display: block
            width: .1em
            height: 100%
            position: absolute
            left: 0
            top: 0
        .tl_marker
            display: flex
            align-items: center
            justify-content: center
            height: 2.25em
            width: 2.25em
            position: absolute
            left: -1.05em
            bottom: calc(50% - 18px)
            padding: .25rem
            line-height: .75rem
            border-radius: 100%
            transition: .15s ease-in-out
            &.checkbox
                border: 2px solid #dbdbdb
                background: #ffffff
        &.left
            margin-left: 0
            margin-right: 2em
            &:before
                right: -.1em
                left: auto
            .tl_marker
                left: auto
                right: -1.2em
            .timeline__card
                margin-right: 2em
        &.right
            margin-left: auto
            .timeline__card
                margin-left: 2em
        &.unread
            .timeline__card
                background: rgba(187, 146, 95, 0.03)
        &.pointer
            .timeline__item_content,
            .timeline__item_marker
                cursor: pointer
        &.checked
            .timeline__item_marker
                border: none
                background: #209cee
                svg
                    opacity: 1
                    transform: none
        &.no-checked
            .timeline__item_content
                opacity: .5
                background: #f5f5f5
                color: #7a7a7a
                .timeline__item_conect,
                .timeline__item_recipients,
                a
                    pointer-events: none
                    color: #7a7a7a
                &:hover
                    opacity: .9
            .timeline__item_marker
                svg
                    opacity: 0
                    transform: scale(.3,.3)
                &:hover + .timeline__item_content
                    opacity: .9
    &__card
        display: flex
        position: relative
        margin-top: .5em
        margin-bottom: .5em
        box-shadow: 0 2px 18px 1px rgba(42, 51, 83, 0.35)
        border-radius: 6px
        width: 100%
        .tl_left
            width: 250px
            padding: 0.75rem
            .subtitle
                margin-bottom: 0.5rem
                padding-bottom: .5rem
                border-bottom: 1px solid #ddd
            .tl_forwarded
                margin-top: 0.5em
                padding-top: .5rem
                border-top: 1px solid #ddd
                .tag
                    margin-right: 5px
                    margin-bottom: 2px
                    max-width: 95%
                    height: auto
                    flex-wrap: wrap
                    position: relative
                    &_tooltip
                        padding: 0
                        &:nth-of-type(2),
                        &:nth-of-type(3)
                            margin-top: 0
                    &_info
                        position: absolute
                        right: -8px
                        top: -8px
                        cursor: pointer
                    &_name
                        margin-right: auto
                        white-space: nowrap
                        overflow: hidden
                        text-overflow: ellipsis
            .tl_conect
                display: block
                font-size: 0.85rem
        .tl_right
            width: 100%
            padding: 0.75rem 1rem
            border-left: 1px solid #bebebe
            .tl_title
                padding: .25em 3.75em .75em 0
                font-size: 1rem
                border-bottom: 1px solid #ddd
                font-weight: 600
            .tl_body
                margin: .5em 0
                width: 100%
                word-break: break-all
            .tl_condition
                display: block
                margin: .5em 0
        .tl_time
            position: absolute
            right: 10px
            top: 10px
            font-size: 11px
            letter-spacing: 1px
</style>
