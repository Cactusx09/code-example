<template>
    <div>
        <card-list label="Avto"
            :content="[
                data.car_brand_name,
                data.car_model_name,
                data.car_modification,
                data.car_engine_size,
                data.car_release_year ? `${data.car_release_year}рік` : '',
                data.car_transmission_name,
                data.car_color_name,
                data.car_fuel_name,
                data.car_race ? `пробіг ${data.car_race}т.км` : '',
                data.car_plate_number ? `номер ${data.car_plate_number}` : '',
                data.car_used === 1 ? 'Б/В' : '',
            ]"/>

        <card-list label="Vartist"
            :content="[
                data.car_market_price ? `ринкова: ${data.car_market_price}грн` : '',
                data.car_insurance_price ? `страхова: ${data.car_insurance_price}грн` : '',
                data.car_expert_price ? `експертна: ${data.car_expert_price}грн` : '',
            ]"/>

        <card-list label="Vartist DO"
            :content="[
                data.car_do_price ? `${data.car_do_price}грн` : '',
            ]"/>

        <slot/>
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
