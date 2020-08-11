<template>
    <div>
        <div class="box blanks-box">
            <div class="columns">
                <div class="column is-3">
                    <div class="label">{{ i18n('Typ blanku') }}</div>
                    <vue-select
                        v-model="filters.policy_blank_types.id"
                        :source="route('administration.policyBlanks.types.options')"
                        :placeholder="i18n('Vyberit typ blanku')"
                        :i18n="i18n"
                        translated
                    />
                </div>
                <div class="column is-3">
                    <div class="label">{{ i18n('Status') }}</div>
                    <vue-select
                        v-model="filters.statuses.id"
                        :source="route('administration.policyBlanks.statuses.options')"
                        :placeholder="i18n('Vyberit status')"
                        :i18n="i18n"
                        translated
                    />
                </div>
                <div class="column is-3">
                    <div class="label">{{ i18n('Ahentsiya') }}</div>
                    <vue-select
                        v-model="filters.agencies.id"
                        :source="route('administration.agencies.selectOptions')"
                        :placeholder="i18n('Vyberit ahentsiya')"
                        :i18n="i18n"
                        translated
                    />
                </div>
                <div class="column is-3">
                    <div class="label">{{ i18n('Yuzer') }}</div>
                    <vue-select
                        v-model="filters.agent_users.id"
                        :source="route('administration.users.options')"
                        :customParams="agencyId"
                        :placeholder="i18n('Vyberit korystuvacha')"
                        :i18n="i18n"
                        translated
                    />
                </div>
            </div>
        </div>

        <vue-table
            :path="path"
            :filters="filters"
            id="policyBlanks"
            ref="policyBlanks"
            class="box is-paddingless raises-on-hover"
            @import="toggleModal('import')"
            @transfer="toggleModal('transfer')">
        </vue-table>

        <modal-blank
            v-if="!!modalBlanks.type"
            v-bind="modalBlanks"
            @close="toggleModal()"
            @save="
                $refs.policyBlanks.$refs.table.state.selected = [];
                $refs.policyBlanks.fetch();
            "
        />
    </div>
</template>

<script>
import { VueSelect } from '@enso-ui/select/bulma';
import { VueTable } from '@enso-ui/tables/bulma';

import ModalBlank from './ModalBlank.vue';

export default {
    components: {
        VueSelect,
        VueTable,
        ModalBlank,
    },

    inject: ['i18n'],

    data() {
        return {
            path: route('administration.policyBlanks.initTable'),
            filters: {
                policy_blank_types: {
                    id: null,
                },
                statuses: {
                    id: null,
                },
                agencies: {
                    id: null,
                },
                agent_users: {
                    id: null,
                },
            },
            modalBlanks: {
                type: null,
                label: '',
                selected: null,
            },
        };
    },

    computed: {
        agencyId() {
            const agencyId = this.filters.agencies.id;

            if (agencyId) {
                return {
                    agency: {
                        id:  agencyId,
                    }
                };
            }

            return null;
        },
    },

    methods: {
        toggleModal(type) {
            switch(type) {
                case 'import': {
                    this.modalBlanks.label = 'Import blankiv';
                    break;
                }
                case 'transfer': {
                    const statePolicyBlanks = this.$refs.policyBlanks.$refs.table.state;

                    if (statePolicyBlanks.pageSelected) {
                        type = 'transferByIds';
                        this.modalBlanks.selected = statePolicyBlanks.selected;
                    }

                    this.modalBlanks.label = 'Peremishchennya blankiv';
                    break;
                }
                default:
                    break;
            }

            this.modalBlanks.type = type;
        },
    },
};
</script>

<style lang="sass">
.blanks-box
    .is-3of2
        width: 5.55555555%
</style>
