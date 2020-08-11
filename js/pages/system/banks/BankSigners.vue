<template>

    <signers
        :path="'system/banks'"
        :params="'bank'"
    />

</template>

<script>

    import Signers from '@pages/administration/agencies/Signers'

    export default {
        components: {
            Signers,
        },
    };

</script>
