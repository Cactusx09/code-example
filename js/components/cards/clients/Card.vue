<template>
    <div>
        <card-list label="Personalni dani"
            :content="[
                data.client_lastname,
                data.client_first_name,
                data.client_surname,
                data.client_phone,
                data.client_email,
            ]"/>

        <card-list label="Dodatkova informatsiya"
            :content="[
                data.company_name,
                data.client_position,
                data.company_basis_of_acting,
                data.company_bank_mfo,
                data.company_bank_name,
                data.company_bank_account,
            ]"/>

        <card-list label="Narodyvsya"
            :content="[
                data.client_birthplace,
                data.client_birthday,
            ]"/>

        <card-list label="Adresa reyestratsiyi"
            :content="[
                data.client_registries_zipcode ? data.client_registries_zipcode : '',
                data.client_registries_region_name,
                data.client_registries_district,
                data.client_registries_city_name ? `м. ${data.client_registries_city_name}` : data.client_registries_city_displayname ? `м. ${data.client_registries_city_displayname}` : '',
                data.client_registries_street ? `вул. ${data.client_registries_street}` : '',
                data.client_registries_house ? `буд. ${data.client_registries_house}` : '',
                data.client_registries_flat ? `кв. ${data.client_registries_flat}` : '',
                data.client_registries_date,
            ]"/>

        <card-list label="Adresa prozhyvannya"
            :content="[
                data.client_actual_zipcode ? data.client_actual_zipcode : '',
                data.client_actual_region_name,
                data.client_actual_district,
                data.client_actual_city_name ? `м. ${data.client_actual_city_name}` : data.client_actual_city_displayname ? `м. ${data.client_actual_city_displayname}` : '',
                data.client_actual_street ? `вул. ${data.client_actual_street}` : '',
                data.client_actual_house ? `буд. ${data.client_actual_house}` : '',
                data.client_actual_flat ? `кв. ${data.client_actual_flat}` : '',
                data.client_actual_residence_period_name,
            ]"/>

        <card-list label="Pasportni dani"
            :content="[
                data.client_passport_series,
                data.client_passport_number,
                data.client_passport_issued,
                data.client_passport_date,
            ]"/>

        <card-list label="Vodiyske"
            :content="[
                data.client_driver_series,
                data.client_driver_number,
                data.client_driver_issued,
                data.client_driver_date,
            ]"/>

        <!-- <card-list label="Simeynyy stan"
            :content="[
                data.client_driver_series ? `діти ${data.client_driver_series},` : '',
                data.client_driver_series ? `на утриманні  ${data.client_driver_series}` : '',
                data.client_driver_series ? data.client_sex_id === 1 ? `одружений` : 'одружена' : '',
            ]"/> -->
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
}
</script>
