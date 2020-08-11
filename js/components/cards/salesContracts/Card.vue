<template>
    <div>
        <div class="row">
            <div class="columns is-vcentered">
                <div class="column is-4 is-offset-4 has-text-centered">
                    <label class="label">{{ i18n('Avtomobil') }}</label>
                </div>
                <div class="column is-4 has-text-centered">
                    <label class="label">{{ i18n('Dodatkove obladnannya') }}</label>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.car_insurance_price.label) }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.car_insurance_price.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.car_do_price.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.prepayment_amount.label) }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.prepayment_amount.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.additional_prepayment_amount.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.credit_subject_amount.label) }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.credit_subject_amount.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.additional_credit_subject_amount.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.payment_purpose.label) }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.payment_purpose.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.additional_payment_purpose.value }}</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="columns is-vcentered">
                <div class="column is-4 is-offset-4 has-text-centered">
                    <label class="label">{{ i18n('Rekvizyty prodavcya avto') }}</label>
                </div>
                <div class="column is-4 has-text-centered">
                    <label class="label">{{ i18n('Rekvizyty prodavcya DO') }}</label>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n('Nazva prodavcya') }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.car_dealer_name.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.do_dealer_name.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.car_dealer_edrpou.label) }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.car_dealer_edrpou.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.do_dealer_edrpou.value }}</span>
                </div>
            </div>

            <div class="columns is-vcentered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.car_dealer_account_name.label) }}:</label>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.car_dealer_account_name.value }}</span>
                </div>
                <div class="column is-4">
                    <span class="tag">{{ data.fields.do_dealer_account_name.value }}</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="columns is-v-centered">
                <div class="column is-4 has-text-right">
                    <label class="label">{{ i18n(data.fields.manager_name.label) }}:</label>
                </div>
                <div class="column is-8">
                    <span class="tag">{{ data.fields.manager_name.value }}</span>
                </div>
            </div>
        </div>

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
        white-space: pre-wrap
        padding: .5em .75em
        word-break: break-all
</style>
