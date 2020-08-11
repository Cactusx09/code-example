<template>
    <div>
        <div
            v-if="show"
            class="timeline__message">
            <div class="columns is-variable is-2">
                <element-validation
                    class="column is-3-fullhd is-3-desktop is-12-mobile"
                    v-model="data.body.topic"
                    :name="'body.topic'"
                    :placeholder="'Vvedit\' temu povidomlennya'"
                    :errors="errors"
                />

                <element-validation
                    class="column is-5-desktop is-12-mobile"
                    :name="'searchUsers'"
                    :errors="errors">
                    <u-search
                        v-if="recControl.radio === 'recipients'"
                        :api-url="'/api/dynamicsearch/timeline/recipients/initUTable'"
                        @accept="updateUsers($event)"
                        :table-search.sync="recControl.users.search"
                        :min-length="1"
                        checkbox>
                        <div class="control has-icons-left has-icons-right">
                            <div
                                class="tagsinput field is-grouped is-grouped-multiline input"
                                @click.self="$refs.searchUsers.focus()">
                                <span
                                    v-for="(user, key) in recControl.users.selected"
                                    :key="`user-${user.person_id}`"
                                    class="tag">
                                    <span class="icon has-text-dark has-margin-right-small">
                                        <fa icon="user"/>
                                    </span>

                                    <span>{{ user.last_name }}</span>

                                    <button
                                        class="delete is-small"
                                        @click="recControl.users.selected.splice(key, 1)"
                                    />
                                </span>

                                <input
                                    v-model="recControl.users.search"
                                    ref="searchUsers"
                                    type="text"
                                    :placeholder="'Пошук по користувачам'"
                                >
                            </div>

                            <span class="icon is-small is-left">
                                <fa icon="search"/>
                            </span>
                        </div>
                    </u-search>

                    <vue-select
                        v-else
                        v-model="data.recipients.mailingGroups"
                        :source="route('administration.timelineMailingGroups.options')"
                        multiple
                    />

                    <div class="columns"
                        style="margin-top: -3px; margin-left: 0px;">
                        <div class="label column is-narrow">
                            <input
                                v-model="recControl.radio"
                                type="radio"
                                id="timelineMailingGroups"
                                value="timelineMailingGroups"
                                class="checkbox">
                            <label for="timelineMailingGroups">{{ `${i18n('Po hrupakh')} (${data.recipients.mailingGroups.length})` }}</label>
                        </div>

                        <div class="label column is-narrow">
                            <input
                                v-model="recControl.radio"
                                type="radio"
                                id="recipients"
                                value="recipients"
                                class="checkbox">
                            <label for="recipients">{{ `${i18n('Po korystuvachakh')} (${recControl.users.selected.length})` }}</label>
                        </div>
                    </div>
                </element-validation>

                <element-validation
                    class="column is-2-desktop is-6-mobile"
                    :name="'recipients.forward_messages.policy'"
                    :errors="errors"
                    :key="'test'">
                    <vue-select
                        v-model="data.recipients.forward_messages.policy"
                        :track-by="'alias'"
                        :options="optionsPolicy"
                        :placeholder="i18n('Vuberit povidomlena')"
                        :has-error="errors.has('recipients.forward_messages.policy')"
                        @input="
                            $emit('policy', $event);
                            errors.clear('recipients.forward_messages.policy');
                        "/>
                </element-validation>

                <div class="column is-narrow"
                    style="margin-left: auto">
                    <button
                        class="button"
                        @click="reset()">
                        {{ i18n('Vidminyty') }}
                    </button>
                </div>

                <div class="column is-narrow">
                    <button
                        class="button is-success"
                        @click="save()">
                        {{ i18n('Nadislaty') }}
                    </button>
                </div>
            </div>

            <div class="columns is-variable is-2">
                <element-validation
                    class="column is-12"
                    :name="'body.message'"
                    :errors="errors"
                    style="padding-top: 0;">
                    <textarea
                        v-model="data.body.message"
                        :class="['textarea', { 'is-danger': errors.has('body.message') }]"
                        @input="errors.clear('body.message')"
                        :placeholder="i18n('Vvedit\' opys povidomlennya')"
                    />
                </element-validation>
            </div>
        </div>
    </div>
</template>

<script>

import { VueSelect } from '@enso-ui/select/bulma';
import USearch from '@components/USearch';

import ElementValidation from '@components/validations/ElementValidation';
import Errors from '@enso-ui/forms/errors';
import errorHandler from '@components/mixins/errorHandler';

import SmoothReflow from 'vue-smooth-reflow';
import OptionsPolicy from './OptionsPolicy';

export default {
    components: {
        VueSelect,
        USearch,
        ElementValidation,
    },

    mixins: [
        OptionsPolicy,
        SmoothReflow,
        errorHandler,
    ],

    inject: ['i18n'],

    props: {
        show: {
            type: Boolean,
            default: false,
        },
        policyMessages: {
            type: Array,
            default: () => ([]),
        },
    },

    data() {
        return {
            data: {
                resource_id: this.$route.params.contract,
                resource_model: 'App\\Models\\InsuranceContract',
                source_url: '/',
                body: {
                    topic: null,
                    message: null,
                },
                recipients: {
                    forward_messages: {
                        policy: 'current',
                        messages: [],
                    },
                    users: [],
                    mailingGroups: [],
                },
            },
            recControl: {
                radio: 'timelineMailingGroups',
                users: {
                    search: null,
                    selected: [],
                },
            },
            errors: new Errors(),
        };
    },

    mounted() {
        this.$smoothReflow();
    },

    methods: {
        updateUsers(users) {
            const usersFilter = users.filter(({ dtRowId }) => {
                const dtRowIdFilter = dtRowId;
                return !this.recControl.users.selected.find(({ dtRowId }) => dtRowId === dtRowIdFilter);
            });

            this.recControl.users.selected = [...this.recControl.users.selected, ...usersFilter];
        },

        save() {
            const formData = this.data;

            formData.recipients.users = this.recControl.users.selected.map(({ dtRowId }) => dtRowId);

            if (formData.recipients.forward_messages.policy === 'selected') {
                formData.recipients.forward_messages.messages = this.policyMessages.slice();
            } else if (formData.recipients.forward_messages.policy === 'current') {
                delete formData.recipients.forward_messages;
            }

            axios.post(route('timeline.postMessage'), formData)
                .then(({ data }) => {
                    this.$toastr.success('Povidomlennya nadislano');
                    this.reset();

                    this.$emit('new-message', data.message);
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },

        reset() {
            const defaultData = {
                body: {
                    topic: null,
                    message: null,
                },
                recipients: {
                    forward_messages: {
                        policy: 'current',
                        messages: [],
                    },
                    users: [],
                    groups: [],
                    mailingGroups: [],
                },
            };

            const defaultRecControl = {
                radio: 'timelineMailingGroups',
                users: {
                    search: null,
                    selected: [],
                },
            };

            this.data = { ...this.data, ...defaultData };
            this.recControl = defaultRecControl;

            this.$emit('reset');
        },
    },
};

</script>

<style lang="sass">
    .timeline__message
        padding: 1rem 0
        border-bottom: 1px solid #ddd
        .tag
            .delete
                margin-left: .5rem
        .tagsinput
            .tag
                margin: 0 0.2rem 0 0
                &:last-of-type
                    margin-right: .4rem;
            .icon
                position: relative
            input
                font-size: 1rem
                &::placeholder
                    opacity: .5
                &:focus
                    outline: none
</style>
