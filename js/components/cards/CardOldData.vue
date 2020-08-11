<template>
    <div v-if="!!data"
        class="message is-info">
        <div class="message-body">
            <div
                v-for="(item, key, index) in data"
                :key="key"
                class="has-margin-right-medium">
                <span class="title is-6">{{ i18n(item.label) }}: </span><!--
                --><span>{{ item.value }}</span><!--
                --><span class="title is-6">{{ index === (Object.keys(data).length - 1) ? '.' : ',' }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: null,
        },
    },
    inject: ['i18n'],
};
</script>

<style lang="sass">
    .message-body
        display: flex
        flex-flow: wrap
        box-shadow: inset 0 0 17px -13px
        .title
            display: inline
</style>
