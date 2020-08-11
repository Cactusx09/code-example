<template>
    <div class="print_form box">
        <div class="columns">
            <div class="column field is-6-fullhd is-6-widescreen is-6-desktop is-6-tablet is-12-mobile">
                <element-validation :label='`Oberit typ dokumentu`'
                    :name="`printing_form_types`"
                    :errors="errors">
                    <vue-select v-model="printingFormTypesSelect"
                        :source="route('references.printingFormTypes.selectOptions')"
                        multiple
                        :placeholder="i18n('Oberit typ dokumentu')"
                        :has-error="errors.has('printing_form_types')"
                        @input="errors.clear('printing_form_types')"/>
                </element-validation>
            </div>
            <div class="column field is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile">
                <element-validation :label='`Kod shablona`'
                    :name="`code`"
                    :errors="errors">
                    <input v-model="data.code"
                        :disabled="!stateEdit"
                        type="text"
                        :placeholder="i18n('Kod shablona')"
                        :class="['input', { 'is-danger': errors.has('code')}]"
                        @input="errors.clear('code')">
                </element-validation>
            </div>
            <div class="column field is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                <element-validation :label='`Nazva shablonu`'
                    :name="`name`"
                    :errors="errors">
                    <input v-model="data.name"
                        :disabled="!stateEdit"
                        type="text"
                        :placeholder="i18n('Nazva shablonu')"
                        :class="['input', { 'is-danger': errors.has('name')}]"
                        @input="errors.clear('name')">
                </element-validation>
            </div>
        </div>
        <div class="print_form__controls columns">
            <div class="column field is-12-fullhd is-12-widescreen is-12-desktop is-12-tablet is-12-mobile">
                <element-validation :label='`Opus shablonu`'
                    :name="`description`"
                    :errors="errors">
                    <textarea v-model="data.description"
                        :disabled="!stateEdit"
                        :placeholder="i18n('Opus shablonu')"
                        :class="['textarea', { 'is-danger': errors.has('description')}]"
                        @input="errors.clear('description')" />
                </element-validation>
            </div>
        </div>
        <div class="print_form__controls columns is-multiline">
            <div class="column field is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                <label class="label">
                    {{ i18n('Stvory`ty` na osnovi') }}
                </label>
                <vue-select v-model="printingFormsBodySelect"
                    ref="printingForms"
                    :source="route('administration.printingForms.selectOptions')"
                    @input="getPrintingForms($event || $route.params.printingForm);
                        dynamicsearch.keywords = '';
                        dynamicsearch.current = '';"
                    :placeholder="i18n('Obraty shablon')"/>
            </div>
            <div class="column field is-4-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                <u-search
                    :api-url="'/api/dynamicsearch/administration/printingForms/initUTable'"
                    @accept="dynamicsearch.current = $event[0].name;
                        inputPrintingFormsBodySelect($event[0].dtRowId);
                        stateChange = true;"
                    @cancel="dynamicsearch.current = '';"
                    :table-search.sync="dynamicsearch.keywords"
                    :min-length="3">
                    <div class="control has-icons-left has-icons-right">
                        <div v-if="dynamicsearch.current.length > 0"
                            class="tagsinput field is-grouped is-grouped-multiline">
                            <span class="tag" >
                                <span class="icon has-text-dark has-margin-right-small">
                                    <fa icon="print" />
                                </span>
                                <span>{{ dynamicsearch.current }}</span>
                                <button class="delete is-small"
                                    @click="dynamicsearch.current = '';
                                    inputPrintingFormsBodySelect()"></button>
                            </span>
                        </div>
                        <u-input type="text"
                            v-model="dynamicsearch.keywords"
                            :placeholder="!dynamicsearch.current.length > 0 ? i18n('Obraty isnuyuchyj kontrakt') : ''"/>
                        <span class="icon is-small is-left">
                            <fa icon="search" />
                        </span>
                    </div>
                </u-search>
            </div>
            <div class="column print_form__buttons is-narrow">
                <button v-if="stateEdit" class="button is-success"
                    @click="savePrintingForms()">
                    {{i18n('Zberehty')}}
                </button>
                <button v-else class="button is-success"
                    @click="stateEdit = true; stateChange = true">
                    {{i18n('Redahuvaty')}}
                </button>
                <button v-if="stateChange && $route.params.printingForm"
                    class="button is-waiting"
                    @click="
                        getPrintingForms();
                        printingFormsBodySelect = null;
                        stateEdit = false;
                        stateChange = false;
                    ">
                    {{i18n('Vidminyty')}}
                </button>
                <button v-if="$route.params.printingForm" class="button is-info"
                    @click="printDocument()">
                    {{ i18n('Nadrukuvaty') }}
                </button>
            </div>
        </div>
        <component-validation v-if="initEditor"
            :name="'body'"
            :errors="errors">
            <pdfEditor ref="pdfEditor"
                :editor-content.sync="data.body"
                :state-edit="stateEdit"
                class="print_form__body columns"
                @input="errors.clear('body')"/>
        </component-validation>
    </div>
</template>

<script>
import ElementValidation from '@components/validations/ElementValidation'
import ComponentValidation from '@components/validations/ComponentValidation'

import pdfEditor from '@components/pdfEditor'
import { VueSelect } from '@enso-ui/select/bulma'
import USearch from '@components/USearch'
import UInput from '@components/UInput'

import Errors from '@enso-ui/forms/src/classes/Errors'
import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ElementValidation,
        ComponentValidation,
        pdfEditor,
        VueSelect,
        USearch,
        UInput,
    },

    inject: ['i18n'],

    mixins: [errorHandler],

    data() {
        return {
            data: {
                printing_form_id: null,
                name: null,
                code: null,
                description: null,
                printing_form_types: [],
                body: ``,
            },
            initEditor: false,
            iframeSrc: '',
            stateEdit: false,
            stateChange: false,
            printingFormTypesSelect: [],
            printingFormsBodySelect: null,
            dynamicsearch: {
                keywords: '',
                current: '',
            },
            errors: new Errors(),
        };
    },

    created() {
        if (this.$route.params.printingForm) {
            this.initEditor = true;
            this.data.printing_form_id = this.$route.params.printingForm;
            this.getPrintingForms();
        } else {
            this.data.body = '';
            this.stateEdit = true;
            setTimeout(() => {
                this.initEditor = true;
            }, 600);
        }
    },

    methods: {
        savePrintingForms(data = this.data) {
            data.printing_form_id = this.$route.params.printingForm;
            data.printing_form_types = this.printingFormTypesSelect.map(id => ({ id }));

            axios.post(route('administration.printingForms.saveData'), data)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.stateEdit = false;
                    this.stateChange = false;

                    this.$router.push({
                        name: 'administration.printingForms.edit',
                        params: {
                            printingForm: String(data.id),
                        },
                    });
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
        getPrintingForms(printing_form_id = this.$route.params.printingForm) {
            if (!printing_form_id) {
                this.data = {
                    name: null,
                    code: null,
                    description: null,
                    printing_form_types: [],
                    body: '',
                }
                this.printingFormTypesSelect = [];
                return;
            }

            axios.get(route('administration.printingForms.getData'), {
                    params: {
                        printing_form_id: printing_form_id,
                    }
                })
                .then(({ data }) => {
                    this.printingFormTypesSelect = data.printing_form_types.map((item) => item = item.id);
                    this.data = data;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        printDocument() {
            this.$refs.pdfEditor.printDocument();
        },
        inputPrintingFormsBodySelect(event) {
            if (!event) {
                if (this.$route.params.printingForm) {
                    event = +this.$route.params.printingForm;
                } else {
                    this.data.body = PrintingFormsTemplate;
                    return;
                }
            }

            this.data.body = this.$refs.printingForms.optionList.find((printingForm) => printingForm.id === event).body;
            this.stateChange = true;
        },
    },
}
</script>

<style lang="sass">

.print_form
    padding-bottom: 0
    &__controls
        align-items: flex-end
        .field:not(:last-child)
            margin-bottom: 0
        .textarea
            min-height: 75px
        .tag
            .delete
                margin-left: .5rem
        .tagsinput
            position: absolute
            z-index: 99999
            left: 40px
            top: 6px
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

    &__body
        border-top: 1px solid #dbdbdb
        align-items: stretch
        margin: 0 -1.25rem -.75rem -1.25rem
        border-bottom-right-radius: 5px
        border-bottom-left-radius: 5px
        overflow: hidden
        height: 800px
        .column
            padding: 0

    &__editor
        position: relative
        .ace_editor
            height: 100%
            width: 100%
        &.hidden
            display: none

    &__viewer
        position: relative
        iframe
            position: absolute
            height: 100%
            width: 100%
            right: 0
            top: 0

    &__buttons
        display: flex
        justify-content: flex-end
        margin-left: auto
        .button
            margin: auto 0.25rem

</style>
