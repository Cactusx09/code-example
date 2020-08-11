<template>

    <custom-enso-table
        class="box is-paddingless raises-on-hover"
        :path="path"
        id="insurancePrograms"
    />

</template>

<script>

    import CustomEnsoTable from '@components/CustomEnsoTable';

    export default {
        components: { CustomEnsoTable },

        data() {
            return {
                path: route('administration.insurancePrograms.initTable'),
            };
        },
    };

</script>
