<template>
    <div ref="uploader">
        <form class="is-marginless"
            @submit.prevent>
            <input class="is-hidden"
                type='file'
                @change="upload()">
        </form>

        <slot name="control"
            :control-events="browseFiles">
            <div v-if="!fileOptions.uploaded"
                @click="browseFiles()"
                class="button">
                <slot>
                    <span class="icon has-text-link">
                        <fa icon="upload"/>
                    </span>
                </slot>
            </div>

            <div v-else
                :class="'uploader__buttons buttons has-addons'">
                <div v-if="fileOptions.file_name"
                    :class="[
                        'uploader__file_name button',
                        styleFinish,
                    ]">
                    <p>{{fileOptions.file_name}}</p>
                </div>

                <a v-if="fileOptions.url"
                    :href="fileOptions.url"
                    :class="[
                        'button is-success',
                        styleFinish,
                    ]">
                    <span class="icon is-small">
                        <fa icon="download" />
                    </span>

                    <p>{{ i18n('Zavantazhyty') }}</p>
                </a>

                <div :class="[
                        'uploader__remove button',
                        styleFinish,
                    ]"
                    @click="fileOptions.delete_url ? deleteFile() : reset()">
                    <span class="icon is-small">
                        <fa icon="trash-alt" />
                    </span>
                </div>
            </div>
        </slot>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faUpload, faDownload, faTrashAlt)

import errorHandler from '@components/mixins/errorHandler'

export default {
    name: 'Uploader',

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        fileKey: {
            type: String,
            default: 'file',
        },
        fileSizeLimit: {
            type: Number,
            default: 20000000,
        },
        value: {
            default: null,
        },
        styleFinish: {
            type: String,
            //default: 'is-small is-table-button',
        },
        api: Boolean,
    },

    data: () => ({
        formData: new FormData(),
        fileOptions: {
            uploaded: false,
            file_name: false,
            delete_url: false,
            url: false,
        }
    }),

    computed: {
        input() {
            return !!this.$el && this.$el.querySelector('input');
        },
    },

    methods: {
        browseFiles() {
            this.input.click();
        },

        upload() {
            const file = this.input.files[0];

            if (this.sizeCheckPasses(file)) {
                this.formData.append(this.fileKey, file);

                if (!this.api) {
                    this.updateOptions({
                        uploaded: true,
                        file_name: file.name,
                    });
                }

                this.$emit('input', this.formData);
                this.$emit('upload');
            }
        },

        updateOptions(options = {}) {
            Object.keys(this.fileOptions).forEach((name) => {
                this.fileOptions[name] = options[name] || false;
            });
        },

        deleteFile() {
            axios.get(this.fileOptions.delete_url)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.reset();

                    this.$emit('delete');
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        sizeCheckPasses(file) {
            if (file.size > this.fileSizeLimit) {
                this.$toastr.warning(`${this.i18n('Rozmir faila')} ${file.name} ${this.i18n('perevyshchuie limit')} ${this.fileSizeLimit} Kb `);
                return false;
            }

            return true;
        },

        reset() {
            this.formData = new FormData();
            this.input.value = null;

            this.updateOptions();
        },
    },
};
</script>

<style lang="sass">
.uploader
    &__buttons
        align-items: stretch
        flex-wrap: nowrap
        .button
            height: auto
            white-space: pre-wrap
            word-break: break-all
    &__file_name
        cursore: default
</style>
