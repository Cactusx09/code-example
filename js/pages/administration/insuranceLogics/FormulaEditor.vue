<template>
    <div class="container-fuild is-fullheight uformula-editor textarea">
        <div v-if="buttons" class="columns uformula-editor__buttons is-variable is-1-mobile is-0-tablet is-3-desktop is-8-widescreen is-2-fullhd">
            <div v-for="(row, indexRow) in buttons"
                :key="indexRow"
                class="column">
                <button v-for="(button, index) in row.controls"
                    :key="index"
                    :class="[row.class, 'button has-margin-right-small has-background-grey-lighter']"
                    @click="insertCell(button, row.class)" >{{button}}</button>
            </div>
        </div>
        <div v-if="visible" class="uformula-editor__editor_wrp textarea is-centered">
            <ace-editor v-model="formula"
                @init="editorInit()"
                @input="changeInput($event)"
                lang="formula"
                theme="ace/theme/chrome"
                width="100%"
                height="100%"
                ref="formulaEditor"/>
        </div>
    </div>
</template>

<script>
import AceEditor from '@components/Ace.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faUndo,
    faRedo,
} from '@fortawesome/free-solid-svg-icons';
library.add( faUndo, faRedo, );

export default {
    inject: ['i18n'],
    props: {
        model: {
            type: String,
        },
        buttons: {
            type: Array,
            required: false,
        },
    },
    components: {
        AceEditor,
    },
    data() {
        return {
            formula: '',
            visible: false,
        }
    },
    created() {
        this.formula = this.model;
        this.visible = true;
    },

    methods: {
        changeInput(e) {
            let editor = this.$refs.formulaEditor.editor;
            this.$emit('update:model', editor.getSession().getValue());
            this.$emit('input');
        },
        editorInit() {
            require('./formula.js');
            require('brace/theme/chrome');

            this.$refs.formulaEditor.editor.setOption("wrap", true);
        },
        updateModel(model) {
            this.$emit('update:model', model.replace(/\n|\s+/g, ' '));
        },
        insertCell(name) {
            let editor = this.$refs.formulaEditor.editor;
            if (name === '\\n') {
                editor.session.insert(editor.getCursorPosition(), '\n');
            } else {
                let range = editor.selection.getRange();
                editor.session.replace(range, `${name} `);
            }
            editor.focus();
        }
    }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto|Roboto+Mono')

.uformula-editor
    border-bottom: 1px solid #ebebeb
    border-radius: 6px
    background-color: #ebebeb
    height: auto
    &__buttons
        padding: 20px
        margin-left: 22px
        &.columns
            padding: 0 10px 10px
            margin-bottom: -10px
            margin-left: 20px
        .column
            flex-basis: auto
            flex-grow: inherit
            button
                &.info
                    background-color: #fff
                    border-color: transparent
                    color: #209cee
                &.warning
                    background-color: #fff
                    border-color: transparent
                    color: #fabc4a
                &.success
                    background-color: #fff
                    border-color: transparent
                    color: #32b861
                &.danger
                    background-color: #fff
                    border-color: transparent
                    color: #f25a6f
    &__editor
        height: 100%
        background: transparent
        padding: .625rem .8rem
        overflow: auto
        font-weight: 700 !important
        &_wrp
            height: 200px
            background: #fcfcfc
            padding: 0
            &.textarea
                border: none
                border-radius: 0
                height: 400px
                &:focus
                    box-shadow: inherit
            .ace_editor
                font-family: 'Roboto', sans-serif
                font-family: 'Roboto Mono', monospace
                font-size: 14px
            .ace-chrome
                .ace_error
                    color: #f25a6f
                .ace_print-margin
                    opacity: 0
                .ace_scroller
                    box-shadow: inset 0 0px 2px hsla(0,0%,4%,.1)
                .ace_test
                    color: #209cee
                .ace_link
                    color: #3273dc
                .ace_succes
                    color: #32b861
                    font-weight: bold
                .ace_wit
                    font-weight: bold
                    color: #fabc4a
                .ace_texts
                    font-style: italic
                    color: #32b861

        .text
            display: inline-block
        &:focus
            background: #fff
        span
            font-weight: 700 !important
        .tag
            font-size: 0.85rem
            &:focus,
            &:active,
            &:focus-within
                background: #fabc4a
        .info
            color: #209cee !important
            background: none
            padding: 0
            font-weight: 700 !important

        .warning
            background: none
            padding: 0
            color: #fabc4a !important
            font-weight: 700 !important
        .success
            background: none
            color: #23d160 !important
            padding: 0 .1rem
            font-weight: 700 !important
        .danger
            background: none
            padding: 0
            color: #f25a6f !important
            font-weight: 700 !important

        .slash
            color: #32b861 !important
        .line
            color: #3273dc !important
            text-decoration: underline
            background: none
            font-weight: 500 !important
        .result
            color: #32b861 !important
</style>
