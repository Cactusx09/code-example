<template>
    <div>
        <div
            class="columns is-vcentered has-margin-bottom-small is-flex-mobile">
            <div class="column is-narrow is-narrow-mobile">
                <div class="title is-marginless is-6">
                    {{ i18n('Obyekty strakhuvannya') }}
                </div>
            </div>
            <div class="column is-paddingless">
                <div class="button is-success"
                    :disabled="data.length >= options.limit"
                    @click="
                        $refs.modal.updateInsuranceObjectParams({
                            insurance_object_type_id: 1,
                            url: options.apiRoutes.getStructure,
                            params: {
                                insurance_object_type_id: 1,
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
                v-for="(object, key) in data"
                :key="`client-${key}`"
                class="column is-6-fullhd is-6-desktop is-12-tablet is-12-mobile">
                <card
                    :key="`insurance-object-${key}`"
                    :title="object.insurance_object_type_name"
                    :controls="{
                        edit: true,
                        detach: $route.params.consultation && !!object.insurance_object_snapshot_id,
                        status: object.pending_cost_estimate_request_id != null ? i18n('Zapyt obroblyayetsya') : null
                    }"
                    :icon="'car'"
                    @edit="
                        $refs.modal.updateInsuranceObjectParams({
                            insurance_object_snapshot_id: object.insurance_object_snapshot_id,
                            url: options.apiRoutes.getBySnapshotId,
                            params: {
                                insurance_object_snapshot_id: object.insurance_object_snapshot_id,
                                ...options.params,
                            },
                        }, true);
                    "
                    divider
                    @detach="$refs.modal.detachObject(object.insurance_object_snapshot_id)"
                    :style="`border: 1px solid ${$store.getters['wizard/inProcess'](object.wizardIndex) ? 'red' : 'transparent'}`"
                    :data-wizard-index="object.wizardIndex">
                    <template #content>
                        <insurance-object :data="object"/>
                    </template>
                </card>
            </div>
        </div>
        <insurance-object-modal
            :options="options"
            :old-data="oldData"
            @detached="detached({ consultationId: $event.consultation_id })"
            @saved="saved({ data: $event })"
            ref="modal"/>
    </div>
</template>

<script>
import Card from '@components/cards/Card'

import InsuranceObject from '@components/cards/insuranceObjects/Card'
import InsuranceObjectModal from '@components/cards/insuranceObjects/InsuranceObjectModal'

import errorHandler from '@components/mixins/errorHandler'

export default {
    inject: ['i18n'],

    mixins: [errorHandler],

    components: {
        Card,

        InsuranceObject,
        InsuranceObjectModal,
    },

    props: {
        options: Object,
        customData: Array,
        oldData: Object,
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
            : this.getObjects();
    },

    methods: {
        getObjects() {
            if (!this.options.apiRoutes.getAll) return;

            axios.get(route(this.options.apiRoutes.getAll), {
                    params: this.options.params
                })
                .then(({ data }) => {
                    this.data = data.data;

                    this.$nextTick(() => this.$emit('loaded', data));
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
                this.getObjects();

                this.$store.dispatch('wizard/setSelectedSections', { whiteList: ['insuranceObjects'] });
            }

        },
        saved({ data }) {
            this.$emit('saved', data);
            this.getObjects();

            if (!!this.$store.getters['wizard/route'])
                this.$store.dispatch('wizard/setSelectedSections', { whiteList: ['insuranceObjects'] });
        },
    },
}
</script>
