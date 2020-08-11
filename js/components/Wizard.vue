<template>
    <div class="wizard">
        <div class="wizard__wrp"
            ref="wizard">
            <div v-for="(section, sectionName) in structure"
                :key="sectionName"
                :class="[
                    'wizard__block',
                    { 'is-paddingless': section.empty },
                ]">
                <slot :name="`title-${sectionName}`"></slot>
                <div class="wizard__item">

                    <div class="wizard__content">
                        <slot :name="sectionName"></slot>
                    </div>

                    <div v-if="init"
                        :class="[
                            'wizard__line',
                            sectionName
                        ]">
                        <div v-for="(group, key) in data[sectionName]"
                            :key="`${group.alias}_${key}`"
                            @click="toggleWizardGroup(key)"
                            :style="groups[key].position"
                            class="wizard__group">
                            <template v-if="!groups[key].invisible">
                                <div :class="[
                                    'wizard__group_group tag is-medium is-light',
                                    styles[groups[key].style].class,
                                    { 'is-hidden' : groups[key].hidden },
                                ]">
                                    <template v-for="(message, index) in groups[key].messages">
                                        <div v-if="message.style !== 'done' || groups[key].style === 'done'"
                                            :key="index"
                                            @click="message.link ? $router.push(message.link) : null"
                                            :class="[
                                                'wizard__group_message',
                                                { 'is-link': message.link },
                                                styles[message.style].class,
                                            ]">
                                            <i class="icon">
                                                <fa :icon="styles[message.style].messageIcon"/>
                                            </i>
                                            <span><span>{{ message.message }}</span></span>
                                        </div>
                                    </template>
                                </div>
                                <span :class="[
                                        'wizard__group_marker button icon',
                                        styles[groups[key].style].class,
                                    ]">
                                    <fa :icon="styles[groups[key].style].groupIcon"/>
                                </span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="wizard__progress">
            <!-- <progress v-if="visible"
                class="progress is-success"
                value="0"
                max="100"
                :style="{
                    width: `${height}px`,
                }">
            </progress>-->
        </div>
    </div>
</template>

<script>

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheck,
    faTimes,
    faPlus,
    faSave,
    faExclamation,
} from '@fortawesome/free-solid-svg-icons';
library.add([faCheck, faTimes, faPlus, faSave, faExclamation, ]);

import { mapState, mapGetters } from 'vuex';

import errorHandler from '@components/mixins/errorHandler'

export default {
    mixins: [errorHandler],

    props: {
        route: {
            type: Object,
        },
        wizardStructure: {
            type: Object,
        },
    },

    data() {
        return {
            init: false,
        };
    },

    computed: {
        // groups() {
        //     return this.$store.getters['wizard/groups'];
        // },
        // wizards() {
        //     return this.$store.getters['wizard/wizards'];
        // },
        ...mapState('wizard', ['styles']),
        ...mapGetters('wizard', ['structure', 'data', 'groups'])
    },

    created() {
        if (this.route) this.$store.commit('wizard/setRoute', this.route);

        this.$store.dispatch('wizard/set', this.wizardStructure).then(() => {
            this.init = true;
        });
    },
    // mounted() {
    //     //this.$nextTick(() => {

    //     const wizard = this.$refs.wizard;

    //     window.addEventListener('scroll', this.calculateHeight());
    //     this.calculateHeight();
    //     this.visible = true;
    // },
    // destroyed() {
    //     const wizard = this.$refs.wizard;
    //     window.removeEventListener('scroll', this.calculateHeight());
    // },
    methods: {
        toggleWizardGroup(key) {
            const style = this.groups[key];
            // if (this.groups[key].style === 'done') return;

            this.$store.commit('wizard/updateGroupHidden', { group: key, hidden: !style.hidden });
        },

        // highlightErrors(key) {
        //     this.$nextTick(() => {
        //         this.data[key].some((item) => {
        //             const el = document.querySelector(`[data-wizard-index="${item.index}"]`);

        //             if (!el) return;

        //             if (item.style === 'inProcess') {
        //                 el.style.border = '1px solid red';
        //                 return true;
        //             } else {
        //                 el.style.border = '1px solid transparent';
        //             }
        //         });
        //     });
        // },
        //  calculateHeight() {
        //      this.height = this.$refs.wizard.clientHeight;
        // },
    },


};
</script>

<style lang="sass">
@import "~bulma/sass/utilities/mixins"

.wizard
    position: relative
    &__block
        display: flex
        flex-direction: column
        padding: 2rem 0
        position: relative
        +widescreen-only
            padding: 1.5rem 0
        &:first-of-type
            padding-top: .7rem
        &:before
            content: ''
            position: absolute
            bottom: -1px
            right: 12px
            width: calc(100% - 12px)
            height: 2px
            background: whitesmoke
        &:last-of-type:before
            content: none
    &__progress
        position: absolute
        top: 0
        right: 2px
        width: 5px
        height: 100%
        border-radius: 4px
        background: whitesmoke
        +widescreen-only
            right: -2px
        +mobile
            right: -4px
            width: 2px
    &__content
        width: 100%
        max-width: calc(100% - 2rem)
        +widescreen-only
            max-width: calc(100% - 1.3rem)
        +mobile
            max-width: 100%

    &__line
        display: flex
        flex-direction: column
        justify-content: space-around
        align-items: flex-end
        position: absolute
        top: 0
        right: -10px
        height: 100%
        z-index: 99
        pointer-events: none
        +widescreen-only
            right: 0
        +mobile
            right: 0

    &__group
        display: flex
        align-items: center
        position: relative
        height: 2rem
        width: 2rem
        pointer-events: all
        +widescreen-only
            min-height: 1.84rem
            min-width: 1.84rem
        &:hover
            .wizard__group_group
                &.tag
                    opacity: 1
                    transform: translateX(-15px) translateY(-50%)
                &.is-hidden,
                &.is-success
                    pointer-events: all
        &_group
            overflow: auto
            max-height: 90px
            &.tag
                width: 200px
                margin-bottom: 0
                margin-right: 14px
                white-space: normal
                height: auto
                line-height: 1.1
                padding: .6em
                position: absolute
                right: 0
                top: 50%
                transform: translateY(-50%)
                text-align: left
                display: block
                transition: .25s
                cursor: pointer
                +widescreen-only
                    font-size: 0.9rem !important
                    margin-right: 0
                +mobile
                    margin-right: 0
                    font-size: 0.85rem !important
                    width: 150px


            &.is-hidden
                opacity: 0
                pointer-events: none
                transform: scale(.9) translateY(-50%) translateX(15px)

            &.is-success
                opacity: 0
                border: 1px solid #22c65b
                transform: scale(.9) translateY(-50%) translateX(15px)
                pointer-events: none
                background-color: whitesmoke !important
                color: #363636 !important
            &.is-danger
                border: 1px solid #e43725
                background-color: whitesmoke !important
                color: #363636 !important
            &.is-warning
                border: 1px solid #ffdd57
                background-color: whitesmoke !important
                color: #363636 !important
        &_message
            display: flex
            align-items: center
            i
                margin-right: 0
                min-width: 18px
            &:not(:last-of-type)
                margin-bottom: 0.4rem
            &.is-success
                i
                    color: $green
                span
                    opacity: 0.7
            &.is-danger
                i
                    color: #e74c3c
            &.is-warning
                i
                    color: $yellow
            &.is-link
                span>span
                    color: #209cee
                    transition: 0.2s
                    box-shadow: inset 0 -1px 0 0 transparent
                &:hover
                    span>span
                        box-shadow: inset 0 -1px 0 0 hsl(0, 0%, 71%)
        &_marker
            display: flex
            align-items: center
            justify-content: center
            min-height: 2rem
            min-width: 2rem
            height: 2rem
            width: 2rem
            padding: .2rem
            border-radius: 100%
            transition: .15s ease-in-out
            border: 2px solid #dbdbdb
            background: #ffffff
            cursor: pointer
            +widescreen-only
                position: absolute
                right: -11px
                min-height: 1.84rem
                min-width: 1.84rem
                height: 1.84rem
                width: 1.84rem
            +mobile
                position: absolute
                right: -10px
                min-height: 1.6rem
                min-width: 1.6rem
                height: 1.6rem
                width: 1.6rem
                font-size: 0.8rem
            &.text
                background: #209cee
                border: none
            &.file
                background: #ffdd57
                border: none
            &.calculationStatusChange
                background: #ffdd57
                border: none
            svg
                transition: .15s ease-in-out

    &__item
        display: flex
        justify-content: space-between
        width: 100%
        border-bottom: 1px solid #f5f5f5
        &:last-of-type
            border: none
        &_message
            margin-right: 20px

</style>
