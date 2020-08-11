<template>
    <div>
        <slot name="title" :label="i18n('Povidomlennia (bez nazvy)')"></slot>

        <slot name="body">
            <div class="tl_body">{{ body.message.trim() }}</div>
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
}
</script>

<style lang="sass" scoped>
.tl_body
    white-space: pre-line
</style>
