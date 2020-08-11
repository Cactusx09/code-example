<template>

    <agents-global :params="{
        agency_id: Number($route.params.agency),
    }"/>

</template>

<script>

    import AgentsGlobal from '@pages/administration/agencies/components/AgentsGlobal'

    export default {
        components: {
            AgentsGlobal,
        },
    };

</script>
