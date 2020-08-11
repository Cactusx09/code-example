<template>
    <div>
        <div class="row">
            <div class="columns is-vcentered">
                <div class="column is-4 is-offset-3 has-text-centered">
                    <label class="label">{{ i18n('Nazva ahentsiyi') }}</label>
                </div>
                <div class="column is-5 has-text-centered">
                    <label class="label">{{ i18n('PIB ahenta') }}</label>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-3-fullhd is-3-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-right">
                    <label class="label">{{ i18n('Avtor') }}:</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.creator_agency.value }}</span>
                </div>
                <div class="column is-5-fullhd is-5-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.creator_agent.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-3-fullhd is-3-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-right">
                    <label class="label">{{ i18n('Prodavets') }}:</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.seller_agency.value }}</span>
                </div>
                <div class="column is-5-fullhd is-5-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.seller_agent.value }}</span>
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
