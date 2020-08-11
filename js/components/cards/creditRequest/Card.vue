<template>
    <div>
        <div class="row">
            <div class="columns is-vcentered">
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile is-offset-4 has-text-centered">
                    <label class="label">{{ i18n('Bazhanyy chas ta mistse') }}</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-centered">
                    <label class="label">{{ i18n('Pryznachenyy chas ta mistse') }}</label>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-right">
                    <label class="label">{{ i18n(data.fields.planned_at.label) }}:</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.desired_at.value }}</span>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.planned_at.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4-fullhd is-4-widescreen is-4-desktop is-4-tablet is-6-mobile has-text-right">
                    <label class="label">{{ i18n(data.fields.planned_bank_branch_address.label) }}:</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.desired_bank_branch_address.value }}</span>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.planned_bank_branch_address.value }}</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="columns is-vcentered">
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile is-offset-4 has-text-centered">
                    <label class="label">{{ i18n(data.fields.manager_name.label) }}</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-centered">
                    <label class="label">{{ i18n(data.fields.manager_phone.label) }}</label>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile has-text-right">
                    <label class="label">{{ i18n('Menedzher') }}:</label>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.manager_name.value }}</span>
                </div>
                <div class="column is-4-fullhd is-4-widescreen is-6-desktop is-6-tablet is-6-mobile">
                    <span class="tag">{{ data.fields.manager_phone.value }}</span>
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
