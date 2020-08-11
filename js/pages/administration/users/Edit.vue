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
                <enso-form class="box has-background-light raises-on-hover animated fadeIn"
                    ref="form"
                    @loaded="
                        ready = true;
                    ">
                    <template v-slot:password="props">
                        <form-field v-bind="props"
                            @focus="props.field.meta.readonly = false"
                            @blur="props.field.meta.readonly = true"
                            @input="password = $event.target.value"
                            v-if="!props.field.meta.hidden"/>
                        <password-strength class="has-margin-top-small"
                            :password="props.field.value"/>
                    </template>
                    <template v-slot:password_confirmation="props">
                        <form-field v-bind="props"
                            @focus="props.field.meta.readonly = false"
                            @blur="props.field.meta.readonly = true"
                            @input="passwordConfirmation = $event.target.value"
                            @keydown="$emit('update');"
                            v-if="!props.field.meta.hidden"/>
                    </template>
                    <template v-slot:positionsList="props">
                        <form-field v-bind="props"
                                    @focus="props.field.meta.readonly = false"
                                    @blur="props.field.meta.readonly = true"
                                    @input="passwordConfirmation = $event.target.value"
                                    @keydown="$emit('update');"
                                    :params="{is_basic: 0}"
                                    v-if="!props.field.meta.hidden"/>
                    </template>
                    <template v-slot:actions>
                        <a class="button is-warning"
                            @click="$router.push({
                                name: 'administration.people.edit',
                                params: { person: $refs.form.param('personId') }
                            })"
                            v-if="ready">
                            <span class="is-hidden-mobile">
                                {{ i18n('Edit Person') }}
                            </span>
                            <span class="icon">
                                <fa icon="user-tie"/>
                            </span>
                            <span class="is-hidden-mobile"/>
                        </a>
                    </template>
                </enso-form>
            </div>
        </div>
    </div>

</template>

<script>
import { EnsoForm, FormField } from '@enso-ui/forms/bulma';
import PasswordStrength from '@core-pages/auth/components/PasswordStrength.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faIdCard, } from '@fortawesome/free-solid-svg-icons';
library.add([
    faIdCard,
]);

export default {
    name: 'Edit',

    components: {
        EnsoForm, FormField, PasswordStrength,
    },

    inject: ['i18n'],

    data: () => ({
        ready: false,
        password: null,
        passwordConfirmation: null,
        topButtons: [{
            label: 'Pidpysanty',
            icon: 'id-card',
            class: 'is-link',
            href: 'administration.users.edit.signs'
        }],
    }),

    methods: {
        topButtonsClick: function ($button) {
            if (typeof $button.href !== undefined) {
                this.$router.push({name: $button.href, params: {user: this.$route.params.user}});
            }
        },
    }
};
</script>
