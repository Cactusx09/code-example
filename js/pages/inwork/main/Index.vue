<template>
    <div class="box is-paddingless">
        <custom-enso-table
            :path="route('inwork.consultations.initAllConsultationTable')"
            id="contracts"
            :custom-edit="customEdit"
            :params="params"
            @create="showModal = true"
        >
            <template #prolongation_count="props">
                <span
                    :class="[
                        'is-clickable',
                        params.insurance_consultations ? 'tag is-link is-table-tag' : 'has-text-link'
                    ]"
                    @click="toggleProlongationParams(props)">
                    {{ i18n(!props.row.is_prolongation ? 'Pershyy rik' : 'Prolonhatsiya') }}
                </span>
            </template>
        </custom-enso-table>

        <modal
            v-if="showModal"
            @close="showModal = false"
            show>
            <div class="box">
                <h5 class="subtitle is-5">
                    {{ i18n('Створити') }}
                </h5>
                <hr>
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <button
                                class="button is-link"
                                @click="
                                    showModal = false;
                                    $nextTick(() => $router.push({ name: 'inwork.consultations.prolongation.create' }));
                                ">
                                {{ i18n('Пролонгація') }}
                            </button>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <button
                                class="button is-success has-margin-left-small"
                                @click="
                                    showModal = false;
                                    $nextTick(() => $router.push({ name: 'inwork.consultation.create' }));
                                ">
                                {{ i18n('Консультація') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import CustomEnsoTable from '@components/CustomEnsoTable';
import { Modal } from '@enso-ui/bulma';

export default {
    components: {
        CustomEnsoTable,
        Modal,
    },
    inject: ['i18n'],
    data() {
        return {
            showModal: false,
            params: {
                insurance_consultations: null,
            },
        };
    },
    methods: {
        customEdit(row) {
            return {
                name: !row.is_prolongation ? 'inwork.consultation.edit' : 'inwork.consultations.prolongation.edit',
                params: {
                    consultation: row.dtRowId,
                },
            };
        },
        toggleProlongationParams(props) {
            const params = {
                prolongation_count: props.row.prolongation_count,
            };

            this.params.insurance_consultations = !this.params.insurance_consultations ? params : null;
        },
    },
};
</script>
