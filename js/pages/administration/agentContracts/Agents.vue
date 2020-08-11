<template>

    <agents-global
        :params="{
            agent_contract_id: Number($route.params.agentContract),
        }"
        only-one
    />

</template>

<script>

    import AgentsGlobal from '@pages/administration/agencies/components/AgentsGlobal'

    export default {
        components: {
            AgentsGlobal,
        },
    };

</script>
