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
            <div class="column is-three-quarters">
                <enso-form class="box has-background-light raises-on-hover animated fadeIn"
                            :route-params="[$route.name, $route.params.bank, false]">
                    <template slot="phone" slot-scope="{ field, errors }">
                        <label class="label">{{field.label}}</label>
                        <input-phone :field="field"
                                    v-model="field.value"
                                    :errors="errors"/>
                    </template>
                </enso-form>
            </div>
        </div>
    </div>

</template>

<script>

    import { EnsoForm } from '@enso-ui/forms/bulma';
    import { VueSelect } from '@enso-ui/select/bulma';
    import InputPhone from '@components/vueforms/InputPhone.vue';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faIdCard } from '@fortawesome/free-solid-svg-icons';
    library.add([ faIdCard ]);

    export default {
        components: { EnsoForm, InputPhone, VueSelect },

        inject: ['i18n'],

        data() {
            return {
                topButtons: [
                    {
                        label: 'Підписанти',
                        icon: 'id-card',
                        class: 'is-link',
                        href: 'system.banks.signers.index'
                    }
                ]
            }
        },

        methods: {
            topButtonsClick($button) {
                if ($button.href) {
                    this.$router.push({
                        name: $button.href,
                        params: {
                            bank: this.$route.params.bank
                        },
                    });
                }
            },
        }
    };

</script>
