<template>
    <div>
        <div class="row">
            <div class="columns is-vcentered">
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-right">
                    <label class="label">{{ i18n(data.fields.car_issuance_datetime.label) }}:</label>
                </div>
                <div class="column is-8-fullhd is-8-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.car_issuance_datetime.value }}</span>
                </div>
            </div>
        </div>

        <slot/>
    </div>
</template>

<script>

export default {
    inject: ['i18n'],

    props: {
        data: Object,
    }
}
</script>

<style lang="sass" scoped>
    .row
        &:not(:last-of-type)
            margin-bottom: 1.5rem
    .column
        padding: .25rem

    .tag
        width: 100%
        height: auto
        white-space: normal
        padding: .5em .75em
        text-align: center
</style>
