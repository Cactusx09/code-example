<template>
    <div>
        <div class="columns is-centered">
            <div class="column is-three-quarters has-text-right-tablet has-text-centered-mobile buttons">
                <router-link
                    v-for="button in topButtons"
                    :key="button.label"
                    :to="{
                        name: button.href,
                        params: {
                            agency: $route.params.agency,
                        }
                    }"
                    class="button is-link">
                    <span class="icon is-small">
                        <fa :icon="button.icon"/>
                    </span>
                    <span class="is-hidden-mobile">
                        {{ i18n(button.label) }}
                    </span>
                </router-link>
            </div>
        </div>

        <div class="columns is-centered">
            <div class="column is-three-quarters">
                <enso-form
                    :route-params="[$route.name, $route.params.agency, false]"
                    class="box has-background-light raises-on-hover animated fadeIn"
                    ref="form"
                />
            </div>
        </div>
    </div>
</template>

<script>

    import { EnsoForm } from '@enso-ui/forms/bulma'
    import { VueSelect } from '@enso-ui/select/bulma'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faUser, faColumns,faHandHoldingUsd, faSignature, faUserTie, faIdCard } from '@fortawesome/free-solid-svg-icons'
    library.add([faUser, faColumns, faHandHoldingUsd, faSignature, faUserTie, faIdCard])

    export default {
        components: { EnsoForm, VueSelect },

        inject: ['i18n'],

        data() {
            return {
                topButtons: [
                    {
                        label: 'Підписанти',
                        icon: 'id-card',
                        href: 'administration.agencies.signers.index'
                    },
                    {
                        label: 'Агенти',
                        icon: 'user',
                        href: 'administration.agencies.agents.index'
                    },
                    {
                        label: 'Плани продажу',
                        icon: 'columns',
                        href: 'administration.agencies.sellingPlans.index'
                    },
                    {
                        label: 'Комісії',
                        icon: 'hand-holding-usd',
                        href: 'administration.agencies.commissions.index',
                    },
                ],
            };
        },
    };

</script>
