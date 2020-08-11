<template>
    <div>
        <card-list label="Tekhpasport"
            :content="[
                data.fields.registration_certificate_series.value,
                data.fields.registration_certificate_number.value,
                data.fields.registration_certificate_issued.value,
                data.fields.registration_certificate_date.value,
            ]"
            :columns-size="columnsSizeClasses"/>

        <card-list label="Avto"
            :content="[
                data.display_name,
            ]"
            :columns-size="columnsSizeClasses"/>

        <card-list label="Pravo na keruvannya"
            :content="[
                data.fields.drive_right.value,
            ]"
            :columns-size="columnsSizeClasses"/>

        <slot></slot>
    </div>
</template>

<script>
import CardList from '../CardList';

export default {
    inject: ['i18n'],

    components: {
        CardList,
    },

    props: {
        data: Object,
    },

    data() {
        return {
            columnsSizeClasses: {
                left: 'is-4',
                right: 'is-8',
            },
        }
    },
}
</script>
