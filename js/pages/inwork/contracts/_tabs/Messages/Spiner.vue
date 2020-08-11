<template>
    <div
        v-if="status"
        :class="[
            'timeline__sync icon has-text-grey-lighter is-large',
            { 'spin': status == 2 },
        ]"
        @click="$emit('update')">
        <fa class="fa-3x" icon="sync"/>
    </div>
</template>

<script>
export default {
    props: {
        status: {
            type: Number,
            default: 0,
        },
    },
};
</script>

<style lang="sass">

.timeline
    &__sync
        margin: 4em auto 3em
        display: flex
        cursor: pointer
        transition: .1s
        &.spin
            opacity: 1
            animation: spin .6s linear infinite
            pointer-events: none
    &__no-messeges
        display: flex
        justify-content: center
        margin-top: 2rem

@keyframes spin
    from
        transform: rotate(0deg)
    to
        transform: rotate(360deg)
</style>
