<template>
    <div :style="{ height: height, width: width }"></div>
</template>

<script>

let ace = require('brace');
require('brace/ext/searchbox');

export default {
    props: {
        value: {
            type: String,
            required: true
        },
        lang: {
            type: String,
            default: 'ace/mode/text'
        },
        theme: {
            type: String,
            default: 'ace/theme/chrome'
        },
        height: {
            default: '100%'
        },
        width: {
            default: '100%'
        },
        options: Object
    },
    data() {
        return {
            editor: null,
            contentBackup: ""
        }
    },
    watch: {
        value(val) {
            if (this.contentBackup !== val){
                this.editor.session.setValue(val, 1);
                this.contentBackup = val;
            }
        },
        options(newOption) {
            this.editor.setOptions(newOption);
        },
        height() {
            this.$nextTick(() => this.editor.resize());
        },
        width() {
            this.$nextTick(() => this.editor.resize());
        }
    },
    beforeDestroy() {
        this.editor.destroy();
        this.editor.container.remove();
    },
    mounted() {
        require('brace/ext/emmet');

        this.editor = ace.edit(this.$el);
        this.$emit('init', this.editor);

        this.editor.$blockScrolling = Infinity;

        this.editor.getSession().setMode(this.lang);
        this.editor.setTheme(this.theme);

        this.editor.session.setValue(this.value, 1);
        this.contentBackup = this.value;

        this.editor.on('change', () => {

            this.$emit('input', this.editor.getValue());
            this.contentBackup = this.editor.getValue();
        });

        if (this.options) this.editor.setOptions(this.options);
    },
}
</script>

<style lang="sass">
.ace
    &_search_form
        display: flex
    &_searchbtn
        display: flex
        align-items: center
</style>
