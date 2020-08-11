<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-three-quarters has-text-right-tablet has-text-centered-mobile">
                <button class="button has-margin-left-small"
                    v-for="button in topButtons"
                    :class="button.class"
                    :key="button.label"
                    @click="topButtonsClick(button)">
                    <span class="icon is-small">
                        <fa :icon="button.icon"/>
                    </span>
                    <span class="is-hidden-mobile">
                        {{ i18n(button.label) }}
                    </span>
                    <span class="is-hidden-mobile"/>
                </button>
            </div>
        </div>
        <div class="columns is-centered">
            <div class="column is-three-quarters-desktop is-full-touch">
                <enso-form class="box form-box has-background-light raises-on-hover"/>
            </div>
        </div>
    </div>
</template>

<script>
import { EnsoForm } from '@enso-ui/bulma';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
library.add([
    faUser,
]);

export default {
    name: 'Edit',

    inject: ['i18n'],

    components: { EnsoForm },

    data() {
        return {
            topButtons: [
                {
                    label: 'Агенти',
                    icon: 'user',
                    class: 'is-link',
                    href: 'administration.agentContracts.agents.index'
                },
            ],
        };
    },

    methods: {
        topButtonsClick: function ($button) {
            if ($button.href !== undefined) {
                this.$router.push({name: $button.href, params: {agentContract: this.$route.params.agentContract}});
            }
        },
    },
};
</script>

<style lang="scss">
</style>
