<template>
    <div>
        <slot name="title" :label="i18n('Status ne vyznachenyy')"></slot>

        <slot name="body">
            <div class="tl_body" v-html="html"></div>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        body: Object,
        condition: String,
    },

    inject: ['i18n'],

    data() {
        return {
            html: '',
        }
    },

    created() {
        this.html = this.getHTML(this.body.message);
    },

    methods: {
        getHTML(html) {
            let structure = '';
            const orders = ['pre', 'text', 'post'];

            for (let item of html) {
                orders.forEach((name) => item[name] ? structure += item[name] : null);
            }
            return structure;
        }
    }
}
</script>

<style lang="sass" scoped>
.tl_body
    white-space: pre-line
    hr
        margin: .2rem 0
        background: #fff
</style>
