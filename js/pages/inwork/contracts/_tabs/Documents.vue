<template>
    <div class="contract box">
        <div class="columns documents__block">
            <div v-for="(block, key) in data.validationBlock"
                :key="key"
                class="contract__document_types column is-3">
                <div class="notification">
                    <h1 class="label">
                        {{`${block.client_roles.map(item => item.name).join(', ')} ${block.person_type.name}`}}
                    </h1>

                    <div class="contract__document_content tags">
                        <span
                            v-for="docType in block.requiredDocumentTypes"
                            :key="docType.id"
                            :class="['tag', docType.added ? 'is-success' : 'is-danger']"
                            @click="fillRowToAdd(block, docType.id)">
                            <span>{{ docType.name }}</span>

                            <fa :icon="docType.added ? 'thumbs-up' : 'exclamation-circle'"/>
                        </span>

                    </div>
                </div>
            </div>
        </div>

        <u-table
            :template.sync="documentsTableTemplate"
            :table.sync="data.documentsTable"
            @remove-row="removeRow($event)"
            ref="docsUploadTable">
            <template #th_file="{ column }" >
                <span>{{ i18n(column.label) }}</span>
                <a
                    :href="`/api/inwork/contracts/documents/downloadZipFiles?model_id=${data.model_id}`"
                    :download="`${i18n('Dokumenty')}.zip`"
                    :title="i18n('Zahruzyty vsi dokumenty v zip')"
                    class="icon is-large has-text-success">
                    <fa size="2x" icon="file-archive"/>
                </a>
            </template>

            <template #file="{ row }">
                <a class="icon is-medium has-text-link"
                    @click.stop="show = true">
                    <fa class="fa-lg" icon="eye"/>
                </a>

                <a :href="row.file.url"
                    :download="row.file.name"
                    target="_blanc"
                    class="icon is-medium has-text-success" >
                    <fa class="fa-lg" icon="file-download"/>
                </a>
            </template>

            <template #created_at="{ row, column }">
                <span>
                    {{ row[column.name] | formatDate() }}
                </span>
            </template>

            <template #addButton="props">
                <button
                    :class="['button', { 'is-success': !props.disabled }]"
                    :disabled="props.disabled"
                    @click="saveRowToAdd(props.rowToAdd)">
                    <span class="icon">
                        <fa icon="plus-square"></fa>
                    </span>
                </button>
            </template>
        </u-table>

        <modal class="modal-gallery"
            :show="show"
            @close="show = false">
            <gallery v-if="show"
                ref="photoGallery"
                :dataItems="data.documentsTable.map(({ file }) => file)"
                class="box">
                <div class="columns gallery__head">
                    <div class="column">
                        <h2 class="title is-5">
                            {{ i18n('Zberezheni dokumenty') }}
                        </h2>
                    </div>

                    <div class="column is-2-fullhd is-2-widescreen is-3-desktop is-6-tablet is-12-mobile">
                        <span class="has-text-dark buttons">
                            <a :href="`/api/inwork/contracts/documents/downloadZipFiles?model_id=${data.model_id}`"
                                :download="`${i18n('Dokumenty')}.zip`"
                                :title="i18n('Zahruzyty vsi dokumenty v zip')"
                                target="_blank"
                                class="button is-fullwidth ">
                                <span class="icon is-medium ">
                                    <fa class="fa" icon="download" />
                                </span>

                                <span>
                                    {{ i18n('Zberehty vsi') }}
                                </span>
                            </a>
                        </span>
                    </div>
                </div>
            </gallery>
        </modal>
    </div>
</template>

<script>
import DocumentsTemplate from '@templates/DocumentsTemplate'

import UTable from '@components/UTable'
import Gallery from '@components/Gallery'

import { Modal } from '@enso-ui/modal/bulma'

import moment from 'moment'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faExclamationCircle,
    faThumbsUp,
    faFileArchive,
    faEye,
    faFileDownload,
} from '@fortawesome/free-solid-svg-icons'
library.add( faExclamationCircle, faThumbsUp, faFileArchive, faEye, faFileDownload )

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        UTable,
        Gallery,
        Modal,
    },

    inject: ['i18n'],

    mixins: [
        DocumentsTemplate,
        errorHandler,
    ],

    data() {
        return {
            show: false,
            data: {
                model_id: null,
                documentsTable: [],
                validationBlock: [],
            },
        }
    },

    created() {
        this.getDocumentsData();
    },

    methods: {
        getDocumentsData() {
            axios.get(route('inwork.contracts.documents.getData'), {
                    params: {
                        model_id: this.$route.params.contract,
                    }
                })
                .then(({ data }) => {
                    Object.keys(data.options).forEach((key) => {
                        if (data.options.hasOwnProperty(key)) {
                            this.documentsTableTemplate.columns[key].props.options = data.options[key];
                        }
                    });

                    this.data.model_id = data.model_id;
                    this.data.documentsTable = data.documentsTable;
                    this.data.validationBlock = this.validationBlock(data.validationBlock);

                    this.$nextTick(() => this.$refs.docsUploadTable.convertMultipleStructure());
                });
        },

        saveRowToAdd(rowToAdd) {
            let formData = rowToAdd.file.value;

            formData.append('model_id', this.data.model_id);

            Object.entries(rowToAdd).forEach(([key, item]) => {
                if (item.value == null) {
                    formData.append(key, '');
                } else {
                    formData.append(key, item.value);
                }
            });

            axios.post(route('inwork.contracts.documents.uploadFile'), formData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.data.documentsTable = data.documentsTable;
                    this.data.validationBlock = this.validationBlock(this.data.validationBlock);

                    this.$nextTick(() => this.$refs.docsUploadTable.convertMultipleStructure());

                    this.$refs.docsUploadTable.$refs.rowToAdd.setDefaultValues();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        fillRowToAdd(block, docTypeId) {
            const refRowToAdd = this.$refs.docsUploadTable.getRowToAdd();

            const uniformityFields = (
                block.client_roles.map(({ id }) => id).includes(refRowToAdd.client_role_id.value)
                && block.person_type.id === refRowToAdd.person_type_id.value
            );

            this.$refs.docsUploadTable.getRowToAdd('client_role_id').value = block.client_roles[0].id;
            this.$refs.docsUploadTable.getRowToAdd('person_type_id').value = block.person_type.id;
            this.$refs.docsUploadTable.getRowToAdd('client_document_types').value = [
                ...uniformityFields ? refRowToAdd.client_document_types.value : [],
                docTypeId,
            ];
        },

        validationBlock(blocks) {
            return blocks.map((block) => {

                const uniformityFields = row => (
                    row.client_document_types
                    && row.person_type_id === block.person_type.id
                    && block.client_roles.map(({ id }) => id).includes(row.client_role_id)
                );

                const filteredDocumentTypeIds = this.data.documentsTable
                    .filter(row => uniformityFields(row))
                    .reduce((result, row) => [...result, ...row.client_document_types.map(({ id }) => id)], []);

                block.requiredDocumentTypes.map((type) => {
                    type.added = filteredDocumentTypeIds.includes(type.id);
                    return type;
                });

                return block;
            });
        },

        removeRow(index) {
            axios.get(route('inwork.contracts.documents.deleteFile'), {
                    params: {
                        model_id: this.data.model_id,
                        media_id: this.data.documentsTable[index].media_id,
                    }
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.data.validationBlock = this.validationBlock(this.data.validationBlock);
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },

    filters: {
        formatDate(date) {
            return moment(date).format('HH:mm DD.MM.YYYY');
        }
    }
};
</script>

<style lang="sass">
.modal-gallery
    .modal-content
        width: calc(100% - 200px)
        height: 100%
        overflow: hidden
        display: flex
        justify-content: center
        align-items: center

.iframeCustom
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
.documents
    &__block
        flex-flow: wrap
        .box
            padding: 0.75rem 1.25rem
.contract
    &__document_types
        .tag
            align-items: middle
            &.is-danger
                cursor: pointer
            &:not(:last-of-type)
                margin-right: .6em
            span
                margin-right: 5px

</style>
