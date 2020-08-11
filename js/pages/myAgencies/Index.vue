<template>
    <div class="columns is-centered">
        <div class="column is-half-fullhd is-full-until-fullhd">
            <div v-if="init"
                class="box has-background-light raises-on-hover">
                <div class="columns">
                    <div class="column is-2"><label class="label">{{ i18n('Korystuvach') }}</label></div>
                    <div class="column is-10"><span class="has-text-info">{{ userDisplayname }}</span></div>
                </div>

                <div class="columns">
                    <div class="column is-2"><label class="label">{{ i18n('Ahentsiya') }}</label></div>
                    <div class="column is-10"><span class="has-text-info">{{ agencyDisplayname }}</span></div>
                </div>

                <div class="columns">
                    <div class="column">
                        <label class="label">{{ i18n('Zminit ahentsiyu') }}</label>
                        <vue-select
                            v-model="agencies.current"
                            :options="agencies.options"
                            :i18n="i18n"
                            disable-clear
                            ref="agenciesSelect"
                        />
                    </div>
                </div>

                <div class="buttons level-right">
                    <button
                        class="button is-success"
                        @click="save()">
                        <span class="is-hidden-mobile">{{ i18n('save') }}</span>
                        <span class="is-small has-margin-left-medium"><fa icon="check"/></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { VueSelect } from '@enso-ui/select/bulma';
import errorHandler from '@components/mixins/errorHandler';

export default {
    name: 'MyAgencies',

    components: { VueSelect },

    inject: ['i18n'],

    mixins: [errorHandler],

    data() {
        return {
            init: false,
            userDisplayname: null,
            agencyDisplayname: null,
            agencies: {
                current: null,
                options: [],
            },
        };
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(route('myAgencies.edit'))
                .then(({ data }) => {
                    this.userDisplayname = data.user_displayname;
                    this.agencyDisplayname = data.agency_displayname;
                    this.agencies.current = data.current;
                    this.agencies.options = data.options;
                })
                .catch((error) => {
                    this.errorHandler(error);
                })
                .finally(() => (this.init = true));
        },
        save() {
            axios.patch(route('myAgencies.update', this.agencies.current))
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.agencyDisplayname = this.$refs.agenciesSelect.selection.name;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>
