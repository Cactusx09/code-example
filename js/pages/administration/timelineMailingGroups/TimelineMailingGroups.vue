<template>
    <div
        v-if="init"
        class="box form-box has-background-light raises-on-hover">
        <div class="columns">
            <div class="column is-6">
                <element-validation
                    v-model="data.name"
                    :label="'Nazva hrupy'"
                    :name="'name'"
                    :errors="errors"
                />
            </div>

            <div class="column is-6">
                <div class="field">
                    <label
                        @click="data.is_active = !data.is_active"
                        class="label">
                        {{ i18n('Aktyvuvaty hrupu') }}
                    </label>

                    <vue-switch
                        v-model="data.is_active"
                        class="vue-switch is-large is-info"
                        size="is-large"
                        type="is-success"
                    />
                </div>
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <h3 class="label">
                    {{ i18n('Notes') }}
                </h3>
                <textarea
                    v-model="data.description"
                    class="textarea"
                />
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <h3 class="label">
                    {{ i18n('Ahentsiyi') }}
                </h3>
                <u-dual-list
                    :source="'administration/agencies/selectOptions'"
                    :columns="['code', 'name']"
                    :data.sync="data.agenciesMultiSelect"
                />
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <h3 class="label">
                    {{ i18n('Banky') }}
                </h3>
                <u-dual-list
                    :source="'system/banks/selectOptions'"
                    :columns="['mfo', 'name']"
                    :data.sync="data.banksMultiSelect"
                />
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <h3 class="label">
                    {{ i18n('Korystuvachi') }}
                </h3>
                <u-dual-list
                    :source="'administration/users/options'"
                    :columns="['', 'person.name']"
                    :data.sync="data.usersMultiSelect"
                />
            </div>
        </div>

        <div class="columns has-margin-top-large">
            <div class="column">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <button class="button is-primary"
                                @click="$router.go(-1)">
                                <span class="is-hidden-mobile">{{ i18n('Back') }}</span>
                                <span class="icon"><fa icon="arrow-left"/></span>
                            </button>
                        </div>

                        <div v-if="$route.params.timelineMailingGroup"
                            class="level-item">
                            <router-link class="button is-info"
                                :to="{ name: 'administration.timelineMailingGroups.create' }">
                                <span class="is-hidden-mobile">{{ i18n('Create') }}</span>
                                <span class="icon"><fa icon="plus"/></span>
                            </router-link>
                        </div>
                    </div>

                    <div class="level-right">
                        <div class="level-item">
                            <button class="button is-success"
                                @click="$emit('save', data)">
                                <span class="is-hidden-mobile">{{ i18n('save') }}</span>
                                <span class="icon"><fa icon="check"/></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import UDualList from '@components/UDualList'
    import VueSwitch from '@enso-ui/switch/bulma'

    import ElementValidation from '@components/validations/ElementValidation'
    import Errors from '@enso-ui/forms/errors'

    export default {
        components: {
            UDualList,
            VueSwitch,
            ElementValidation,
        },

        inject: ['i18n'],

        props: {
            init: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                data: {
                    name: null,
                    description: null,
                    is_active: false,
                    agenciesMultiSelect: [],
                    banksMultiSelect: [],
                    usersMultiSelect: [],
                },
                errors: new Errors,
            };
        },

        methods: {
            updateData(data) {
                this.data = { ...this.data, ...data };
            },
        },
    };

</script>
