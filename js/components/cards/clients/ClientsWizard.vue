<template>
    <div>
        <div
            class="columns is-vcentered has-margin-bottom-small is-flex-mobile">
            <div class="column is-narrow is-narrow-mobile">
                <div class="title is-marginless is-6">
                    {{ i18n('Kliyenty') }}
                </div>
            </div>
            <div class="column is-paddingless">
                <div class="button is-success"
                    :disabled="data.length >= options.limit"
                    @click="
                        $refs.modal.updateClientParams({
                            client_person_type_id: 1,
                            url: options.apiRoutes.getStructure,
                            params: {
                                client_person_type_id: 1,
                                ...options.params
                            },
                        }, true);
                    ">
                    <span class="icon">
                        <fa icon="plus"/>
                    </span>
                </div>
            </div>
        </div>
        <div class="columns is-multiline">
            <div
                v-for="(client, key) in data"
                :key="`client-${key}`"
                class="column is-6-fullhd is-6-desktop is-12-tablet is-12-mobile">
                <card
                    :title="[client.client_role_name, client.client_person_type_name]"
                    :icon="'user'"
                    :controls="{
                        edit: true,
                        detach: options.params.stateAlias === 'consultation' && !!client.client_snapshot_id,
                        status: i18n(client.client_sign_name),
                    }"
                    @edit="
                        $refs.modal.updateClientParams({
                            client_snapshot_id: client.client_snapshot_id,
                            url: options.apiRoutes.getBySnapshotId,
                            params: {
                                client_snapshot_id: client.client_snapshot_id,
                                ...options.params
                            },
                        }, true);
                    "
                    divider
                    :style="`border: 1px solid ${$store.getters['wizard/inProcess'](client.wizardIndex) ? 'red' : 'transparent'}`"
                    @detach="$refs.modal.detachClient(client.client_snapshot_id)">
                    <template #content>
                        <client :data="client"/>
                    </template>
                </card>
            </div>
        </div>

        <client-modal
            :options="options"
            :financial-situation="financialSituation"
            :old-data="oldData"
            :contract-created-at="contractCreatedAt"
            @detached="detached({ consultationId: $event.consultation_id })"
            @saved="saved({ data: $event })"
            ref="modal"
        />
    </div>
</template>

<script>
import Card from '@components/cards/Card'

import Client from '@components/cards/clients/Card'
import ClientModal from '@components/cards/clients/ClientModal'

import errorHandler from '@components/mixins/errorHandler'

export default {
    inject: ['i18n'],

    components: {
        Card,

        Client,
        ClientModal,
    },

    mixins: [errorHandler],

    props: {
        options: Object,
        customData: Array,
        financialSituation: Boolean,
        oldData: Object,
        contractCreatedAt: String,
    },

    data() {
        return {
            data: [],
        }
    },

    watch: {
        customData: {
            handler() {
                this.data = this.customData;
            },
            deep: true,
        },
    },

    created() {
        this.customData
            ? this.data = this.customData
            : this.getClients();
    },

    methods: {
        getClients() {
            if (!this.options.apiRoutes.getAll) return;

            axios.get(route(this.options.apiRoutes.getAll), {
                    params: this.options.params
                })
                .then(({ data }) => {
                    this.data = data.data;

                    // this.$nextTick(() => this.$emit('loaded', data));
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        detached({ consultationId }) {
            if (consultationId != this.$route.params.consultation) {
                this.$router.push({
                    name: 'inwork.consultation.edit',
                    params: { consultation: consultationId }
                });
            } else {
                this.getClients();

                this.$store.dispatch('wizard/setSelectedSections', { whiteList: ['clients'] });
            }

        },
        saved({ data }) {
            this.$emit('saved', data);
            this.getClients();

            if (!!this.$store.getters['wizard/route'])
                this.$store.dispatch('wizard/setSelectedSections', { whiteList: ['clients'] });
        },
    },
}
</script>
