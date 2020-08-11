<template>
    <div v-if="status != null"
        class="printForm box">
        <div class="printForm-control">
            <div class="level">
                <div class="level-left"><h3 class="subtitle is-5">{{ i18n(title) }}</h3></div>

                <vue-select
                    v-if="status < 2 && printingForms.length > 0"
                    v-show="visiblePrintingForms"
                    v-model="filterProductSubtype"
                    :options="optionsProductSubtypes"
                    track-by="name"
                    label="name"
                    :placeholder="i18n('Filter po pidtypu produktu')"
                    class="has-margin-right-medium"
                />

                <div v-if="status == 0"
                    class="level-right">
                    <button class="button is-success"
                        @click="generatePrintingForms('generate')">
                        {{ i18n('Sformuvaty') }}
                    </button>
                </div>

                <div v-else
                    class="level-right">
                    <vue-select
                        v-if="[2, 3].includes(status)"
                        v-model="data.printing_form_id"
                        :source="route('administration.printingForms.selectOptions')"
                        :pivot-params="pivotPrintingForms"
                        :placeholder="i18n('Oberit maket dokumentu')"
                        :disabled="status == 3"
                        class="has-margin-right-medium"
                        disable-clear
                        @selection="$event ? data.printing_form_body = $event.body : null"
                    />

                    <div
                        v-if="status == 1"
                        :key="1">
                        <button
                            class="button is-info"
                            @click="generatePrintingForms('regenerate')">
                            <span>{{ i18n('Pereformuvaty') }}</span>
                            <span class="icon has-margin-left-medium">
                                <fa icon="sync"/>
                            </span>
                        </button>
                        <button
                            class="button is-warning"
                            :disabled="!data.insurance_contract_printing_form_id"
                            @click="getStatus(2)">
                            <span>{{ i18n('Zminyty') }}</span>
                            <span class="icon has-margin-left-medium">
                                <fa icon="exchange-alt"/>
                            </span>
                        </button>
                    </div>

                    <div
                        v-else-if="status == 2"
                        :key="2">
                        <button
                            class="button is-warning"
                            @click="getStatus(3)">
                            <span class="icon has-margin-right-medium">
                                <fa icon="pencil-alt"/>
                            </span>
                            <span>{{ i18n('Redahuvaty') }}</span>
                        </button>
                        <button
                            @click="getPrintingForms()"
                            class="button is-danger">
                            <span class="icon has-margin-right-medium">
                                <fa icon="arrow-left"/>
                            </span>
                            <span>{{ i18n('Vyyty') }}</span>
                        </button>
                    </div>

                    <div
                        v-else-if="status == 3"
                        :key="3">
                        <button
                            class="button is-success"
                            v-prevent-clicks
                            @click="savePrintingForms()">
                            <span>{{ i18n('Zberehty ta vyyty') }}</span>
                            <span class="icon has-margin-left-medium">
                                <fa icon="save"/>
                            </span>
                        </button>
                        <button
                            @click="getStatus(2)"
                            class="button is-danger">
                            <span>{{ i18n('Cancel') }}</span>
                            <span class="icon has-margin-left-medium">
                                <fa icon="times"/>
                            </span>
                        </button>
                    </div>

                    <button
                        class="button has-margin-left-medium is-success"
                        :disabled="!data.insurance_contract_printing_form_id"
                        @click="$refs.pdfEditor.downloadDocument()">
                        <span>{{ i18n('Zavantazhyty') }}</span>
                        <span class="icon has-margin-left-medium">
                            <fa icon="download"/>
                        </span>
                    </button>

                    <button
                        class="button has-margin-left-medium is-info"
                        :disabled="data.isWatermarked"
                        @click="$refs.pdfEditor.printDocument()">
                        <span>{{ i18n('Nadrukuvaty') }}</span>
                        <span class="icon has-margin-left-medium">
                            <fa icon="print"/>
                        </span>
                    </button>
                </div>
            </div>

            <div v-if="[2, 3].includes(status)"
                class="printForm-notes columns">
                <div class="column is-12">
                    <textarea
                        v-model="data.printing_form_description"
                        :disabled="status != 3"
                        class="textarea"
                        type="text"
                        :placeholder="i18n('Opus shablonu')"/>
                </div>
            </div>

            <u-table
                v-if="status < 2 && printingForms.length > 0"
                v-show="visiblePrintingForms"
                :template="templatePrintForms"
                :table.sync="filteredPrintingForms"
                :scroll="5"
                class="has-margin-bottom-large">
                <template slot="actions" slot-scope="{ row }">
                    <button class="button is-small is-table-button has-text-primary"
                        @click="updateData(row)">
                        <span class="icon is-small">
                            <fa v-show="row.isActive" icon="check"/>
                        </span>
                    </button>
                </template>
            </u-table>

            <div
                v-if="status < 2 && printingForms.length > 0"
                class="level-right">
                <div
                    class="dropdown-indicator has-text-info"
                    @click="visiblePrintingForms = !visiblePrintingForms">
                    <span>{{ i18n(!visiblePrintingForms ? 'Rozhornuty tablytsiu' : 'Zhornuty tablytsiu') }}</span>

                    <dropdown-indicator :open="visiblePrintingForms"/>
                </div>
            </div>
        </div>

        <pdfEditor v-if="data.insurance_contract_printing_form_id"
            ref="pdfEditor"
            :editor-content.sync="data.printing_form_body"
            :variables="data.variables"
            :state-edit="status == 3"
            :is-watermarked="data.isWatermarked"
            hidden-variables
            class="printForm-editor columns"/>
    </div>
</template>

<script>
import pdfEditor from '@components/pdfEditor.vue';
import { VueSelect } from '@enso-ui/select/bulma';
import UTable from '@components/UTable'
import DropdownIndicator from '@enso-ui/dropdown-indicator'

import PrintForm from './templates/PrintForm'

import errorHandler from '@components/mixins/errorHandler'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSync, faPencilAlt, faSave, faTimes, faArrowLeft, faPrint, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
library.add([faSync, faPencilAlt, faSave, faTimes, faArrowLeft, faPrint, faExchangeAlt])

export default {
    components: {
        pdfEditor,
        VueSelect,
        UTable,
        DropdownIndicator,
    },

    inject: ['i18n'],

    mixins: [errorHandler, PrintForm],

    data() {
        return {
            status: null,
            data: {
                insurance_contract_printing_form_id: null,
                printing_form_id: null,
                isWatermarked: true,
                printing_form_code: null,
                printing_form_description: '',
                printing_form_name: '',
                printing_form_body: "",
                printingFormTypes: [],
                variables: {},
            },
            visiblePrintingForms: true,
            printingForms: [],

            title: null,
            filterProductSubtype: null,
        };
    },

    created() {
        this.getPrintingForms()
            .then(() => {
                const contractPrintingFormId = this.$route.params.contractPrintingFormId;
                if (contractPrintingFormId) {
                    const contractPrintingFormRow = this.printingForms.find(({ insurance_contract_printing_form_id }) => (
                        insurance_contract_printing_form_id === contractPrintingFormId
                    ));

                    this.updateData(contractPrintingFormRow);
                }
            });
    },

    computed: {
        pivotPrintingForms() {
            return {
                printingFormTypes: {
                    id: this.data.printingFormTypes.map((row) => row.id),
                }
            }
        },
        filteredPrintingForms() {
            return this.filterProductSubtype
                ? this.printingForms.filter((item) => item.calculation_product_subtype == this.filterProductSubtype)
                : this.printingForms;

        },
        optionsProductSubtypes() {
            let hashProductSubtypes = {};

            return this.printingForms.filter((row) =>
                    !hashProductSubtypes.hasOwnProperty(row.calculation_product_subtype)
                        ? hashProductSubtypes[row.calculation_product_subtype] = !0
                        : !1
                )
                .map((row) => ({ name: row.calculation_product_subtype }));
        },
    },

    methods: {
        updatePrintingForms(data, id) {
            this.printingForms = data.map((row) => {
                row.isActive = row.insurance_contract_printing_form_id === id;
                return row;
            });
        },

        updateData(row) {
            const { isActive, ...filterRow } = row;
            this.updatePrintingForms(this.printingForms, row.insurance_contract_printing_form_id);

            this.data = filterRow;
        },

        getPrintingForms() {
            return axios.get(route('inwork.contracts.printingForms.getData'), {
                    params: {
                        insurance_contract_id: this.$route.params.contract,
                    }
                })
                .then(({ data }) => {
                    this.getStatus(data.isGenerated ? 1 : 0);

                    this.updatePrintingForms(data.printingForms, this.data.insurance_contract_printing_form_id);
                });
        },

        generatePrintingForms(name) {
            axios.get(route(`inwork.contracts.printingForms.${name}`), {
                    params: {
                        insurance_contract_id: this.$route.params.contract,
                    }
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.getPrintingForms();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        savePrintingForms() {
            axios.post(route('inwork.contracts.printingForms.saveCustom'), {
                    insurance_contract_id: this.$route.params.contract,
                    ...this.data,
                })
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.data.printing_form_id = data.printing_form_id;
                    this.data.insurance_contract_printing_form_id = data.insurance_contract_printing_form_id;

                    this.getPrintingForms();

                    this.getStatus(1);
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        getStatus(status = 0) {
            switch(status) {
                case 0:
                    this.title = 'Formuvannya formy dlya druku';
                    break;
                case 1:
                case 2:
                    this.title = 'Poperedniy perehlyad form dlya druku';
                    break;
                case 3:
                    this.title = 'Redahuvannya forma dlya druku';
                    break;
            }

            this.status = status;
        },
    },
}
</script>

<style lang="sass">
.utable
    &__table
        tr.is-active
            color: #ffffff
            background: #00d1b2 !important
            font-weight: 700
            .button
                cursor: default
                pointer-events: none

.printForm
    padding-bottom: 0
    &-control
        padding-bottom: 1.25rem
        .level-left
            width: 25%
        .dropdown-indicator
            display: flex
            align-items: center
            cursor: pointer
    &-notes
        align-items: flex-end
        .textarea
            min-height: 85px
    &-editor
        border-top: 1px solid #dbdbdb
        align-items: stretch
        margin: 0 -1.25rem -.75rem -1.25rem
        border-bottom-right-radius: 5px
        border-bottom-left-radius: 5px
        overflow: hidden
        height: 800px
        .column
            padding: 0
    .dropdown.vue-select
        width: 20em

.print_form

    &__editor
        position: relative
        .ace_editor
            height: 100%
            width: 100%;
            position: absolute

    &__viewer
        position: relative
        iframe
            position: absolute
            height: 100%
            width: 100%
            right: 0
            top: 0

</style>
