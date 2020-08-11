<template>
    <modal-card
        class="modal__full"
        :show="show"
        @close="$emit('close')">
        <template #header>
            <div class="title is-5">
                {{`${data.objectName} ${data.objectReleaseYear} ${i18n('rik')}, ${data.objectVin}`}}
            </div>
        </template>

        <template #body>
            <div class="columns">
                <div class="column is-2">
                    <label class="label">{{ i18n('Data redahuvannya') }}</label>
                </div>
                <div class="column is-10">
                    {{ data.updatedAt }}
                </div>
            </div>

            <div class="columns">
                <div class="column is-2">
                    <label class="label">{{ i18n('Avtor') }}</label>
                </div>
                <div class="column is-10">
                    {{ data.updatedBy }}
                </div>
            </div>

            <u-dual-list
                :source="'administration/agencies/selectOptions'"
                :columns="['code', 'name']"
                :data.sync="data.agencyData"
            />
        </template>

        <template #footer>
            <button
                class="button is-danger is-small"
                @click="$emit('close')">
                {{ i18n('cancel') }}
            </button>

            <button class="button is-success"
                v-prevent-clicks
                @click="save()">
                {{ i18n('save') }}
                <span class="is-small has-margin-left-medium">
                    <fa icon="save"/>
                </span>
            </button>
        </template>
    </modal-card>
</template>

<script>
import { ModalCard } from '@enso-ui/modal/bulma';
import UDualList from '@components/UDualList';

import errorHandler from '@components/mixins/errorHandler';

export default {
    components: {
        ModalCard,
        UDualList,
    },

    props: {
        objectId: {
            type: Number,
            default: null,
        },
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    data() {
        return {
            show: false,
            data: {
                objectName: null,
                objectReleaseYear: null,
                objectVin: null,
                updatedAt: null,
                updatedBy: null,
                agencyData: [],
            },
        };
    },

    methods: {
        fetch() {
            axios.get(route('administration.agencyInsuranceObjectAssignments.edit'), {
                    params: {
                        objectId: this.objectId,
                    }
                })
                .then(({ data }) => {
                    this.data = data;
                    this.show = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        save() {
            axios.patch(route('administration.agencyInsuranceObjectAssignments.update'), {
                    objectId: this.objectId,
                    agencyIds: this.data.agencyData.map(({ id }) => id),
                })
                .then(({ data }) => {
                    this.$emit('save');
                    this.$emit('close');
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },

    watch: {
        objectId(objectId) {
            objectId
                ? this.fetch()
                : this.show = false;
        },
    },
};
</script>

<style lang="sass">
.modal__full
    .modal
        &-card
            width: calc(100% - 200px)
            max-width: 1600px
            background-color: white
            border-radius: 6px
            box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
            color: #4a4a4a
            &-foot
                justify-content: flex-end
        &-content
            width: 100%
</style>
