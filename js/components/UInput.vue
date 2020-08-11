<template>
    <textarea
        v-if="type === 'textarea'"
        v-bind="$attrs"
        v-model="model"
        @input="updateModel(model)"
        :class="className"
        class="textarea is-small">
    </textarea>
    <div v-else-if="type === 'checkbox'">
        <input
            v-model="model"
            v-bind="$attrs"
            :type="type"
            @input="updateModel(model)"
            :class="className"
            class="is-checkradio">
        <label @click="
            model = !model;
            updateModel(model);
        "/>
    </div>
    <span
        v-else
        class="uinput uinput__number"
        v-click-outside="cancelСhanges"
        @mouseup="stopSlickNumber()">
        <input
            v-bind="$attrs"
            :readonly="controler ? disabled : readonly"
            v-model.trim="model"
            :class="[
                'input',
                { 'focus': !disabled },
                { 'is-danger': danger },
                className,
            ]"
            @keyup="validateInput(model)"
            @click="disabled = false"
            @keyup.enter="
                updateModel(model);
                $emit('submit');
            "
            @keyup.esc="cancelСhanges()"/>
        <div :class="['controler', { 'focus': !(controler && disabled) }]">
            <div
                v-if="type === 'number'"
                class="controler_item arrows has-margin-left">
                <span
                    class="arrow"
                    :readonly="max === model"
                    @mousedown="changeNumber(true)">
                    <fa icon="caret-up" />
                </span>
                <span
                    class="arrow"
                    :readonly="min === model"
                    @mousedown="changeNumber(false)">
                    <fa icon="caret-down" />
                </span>
            </div>
            <div class="controler_buttons has-margin-left">
                <a
                    v-if="controler"
                    class="controler_item button is-small is-table-button is-success"
                    @click="updateModel()">
                    <span class="icon is-small">
                        <fa icon="check" />
                    </span>
                </a>
                <a
                    v-if="controler"
                    class="controler_item button is-small is-table-button is-danger"
                    @click="cancelСhanges()">
                    <span class="icon is-small">
                        <fa icon="times" />
                    </span>
                </a>
            </div>
        </div>
    </span>
</template>

<script>
import vClickOutside from 'v-click-outside';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPlusSquare,
    faCheck,
    faTimes,
    faSearch,
    faCaretUp,
    faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
library.add(
    faPlusSquare,
    faCheck,
    faTimes,
    faSearch,
    faCaretUp,
    faCaretDown,
);

export default {
    inject: ['i18n'],
    inheritAttrs: false,
    props: {
        readonly: {
            type: Boolean,
            required: false
        },
        danger: {
            type: Boolean,
            required: false
        },
        type: {
            required: false,
        },
        default: {
            required: false,
        },
        controler: {
            required: false,
            default: false,
        },
        className: {
            required: false,
        },
        before: {
            required: false,
            default: '',
        },
        after: {
            required: false,
            default: '',
        },
        round: {
            type: Number,
            required: false,
            default: 0,
        },
        max: {
            type: Number,
            required: false,
        },
        min: {
            type: Number,
            required: false
        },
        value: {
            required: false,
            default() {
                return this.default === 0 || this.default ? this.default : null;
            },
        },
    },

    directives: {
        clickOutside: vClickOutside.directive,
    },

    data() {
        return {
            model: this.value,
            disabled: true,
            slickNumber: null,
            cacheSlickNumber: null,
            tempSlickNumber: 200,
        }
    },

    created() {
        this.validateInput();
    },

    watch: {
        value(value) {
            this.validateInput(value);
        },
    },

    methods: {
        changeNumber(target) {
            let number = target ? 1 : -1;
            number = number / (10 ** this.round);

            this.validateInput((Number(this.value) + number).toFixed(this.round));
            this.runSlickNumber(number);
        },
        runSlickNumber(number) {
            this.slickNumber = setInterval(() => {
                this.validateInput((this.model + number).toFixed(this.round));
                if (this.tempSlickNumber > 27) {
                    this.tempSlickNumber = this.tempSlickNumber/((this.tempSlickNumber/100)/5 + 1);
                    clearInterval(this.slickNumber);
                    this.runSlickNumber(number);
                }
            }, this.tempSlickNumber);
        },
        stopSlickNumber() {
            clearInterval(this.slickNumber);
            this.cacheSlickNumber = this.slickNumber;
            this.tempSlickNumber = 200;
        },
        validateInput(value = this.value) {
            if (value && this.type === 'number') {
                if (value > this.max) value = this.max;
                if (value < this.min) value = this.min;

                value = String(value).replace(/[^0-9.-]/g, '')
                    .replace(/(\..*)\./g, '$1')
                    .replace(/(?!^)-/g, '');

                if (this.cacheSlickNumber === this.slickNumber) {
                    value = value[value.length - 1] !== '.' && value[value.length - 1] !== '0' ? Number(value) : value;
                } else {
                    value = Number(value);
                };
            }

            // this.controler ? this.model = value : this.$emit('update:model', value);
            // this.$emit('change-model', value);
            this.model = value;
            this.$emit('input', value);
        },
        updateModel(value) {
            // if (!this.value || this.value === '0' && this.type === 'number') this.value = 0;
            // this.$emit('update:model', this.model);
            // this.$emit('update-model', this.model);
            this.$emit('input', value || this.value);
            this.disabled = true;
        },
        cancelСhanges() {
            if (this.slickNumber && this.slickNumber !== this.cacheSlickNumber) this.stopSlickNumber();
            // this.$nextTick(() => this.model = this.value);
            this.disabled = true;
        },
    },
}
</script>

<style lang="sass" scoped>
    .textarea
        min-height: 40px
        padding: 0.25em 0.50em
    .uinput
        width: 100%
        &[disabled]
            cursor: not-allowed
            .controler
                pointer-events: none
                .arrow svg
                    opacity: .4
        .input
            &[readonly]
                cursor: text
            &[disabled]
                cursor: not-allowed
        &__number
            position: relative
            display: flex
            justify-content: left
            align-items: center
            .input
                padding-right: 25px
        .controler
            position: absolute
            left: calc(100% - 25px)
            visibility: hidden
            overflow: hidden
            display: flex
            align-items: center;
            &_buttons
                display: flex
                flex-direction: column
                .button
                    height: 1.6em
                    padding: 0.4em
                    font-size: .8em
                    margin: 0.1em .2em
            &_item
                transition: .16s ease-in-out
                transform: translateX(50px)
                opacity: 0
                z-index: 9
            &.focus
                visibility: visible
                .controler_item
                    transform: none
                    opacity: 1

            .arrows
                display: flex
                flex-direction: column
                justify-content: space-between
                height: 30px
                width: 20px
                user-select: none
            .arrow
                font-size: 0.8em
                width: 100%
                height: 50%
                display: flex
                justify-content: center
                cursor: pointer
                svg
                    transition: .1s
                    opacity: .7
                &:first-of-type
                    align-items: flex-end
                    svg
                        margin-bottom: -2px
                &:last-of-type
                    align-items: flex-start
                    svg
                        margin-top: -2px

                &:hover
                    box-shadow: inset 0 0 15px -6px rgba(74, 74, 74, 0.1)
                    svg
                        opacity: 1
                        transform: scale(1.1,1.1)

                &:active
                    svg
                        opacity: .9
                        transform: none
                &[readonly]
                    cursor: default
                    svg
                        opacity: .4
                        transform: none

</style>
