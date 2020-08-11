<template>
    <div>
        <div class="insurance-logics__item">
            <div class="columns">
                <div class="column field is-3-fullhd is-4-widescreen is-4-desktop is-6-tablet is-12-mobile">
                    <element-validation v-model="data.code"
                        :label='`Kod`'
                        :name="`code`"
                        :placeholder="`Vuberit code`"
                        :errors="errors"/>
                </div>
                <div class="column field is-9-fullhd is-8-widescreen is-8-desktop is-6-tablet is-12-mobile">
                    <element-validation v-model="data.name"
                        :label='`Name`'
                        :name="`name`"
                        :placeholder="`Vuberit name`"
                        :errors="errors"/>
                </div>
            </div>
            <div class="columns">
                <div class="column field is-12-fullhd is-12-widescreen is-12-desktop is-12-tablet is-12-mobile">
                    <element-validation :label='`Opus`'
                        :name="`description`"
                        :errors="errors">
                        <textarea v-model="data.description"
                            :placeholder="'Opus'"
                            :class="['textarea has-fixed-size', { 'is-danger': errors.has('description') }]"
                            @input="errors.clear('description')" />
                    </element-validation>
                </div>
            </div>
        </div>
        <component-validation v-if="init"
            class="insurance-logics__item"
            :label="`Formula`"
            :name="'formula'"
            :errors="errors">
            <template>
                <div class="columns insurance-logics__head">
                    <div class="column field is-4-fullhd is-4-widescreen is-4-desktop is-6-tablet is-12-mobile">
                        <vue-select v-model="selectFormula.model"
                            ref="selectFormula"
                            :source="route('administration.insuranceLogics.selectOptions')"
                            :placeholder="i18n('Stvoryty na osnovi')"/>
                    </div>
                    <div class="column">
                        <button class="button is-success has-margin-left-small"
                            :disabled="!selectFormula.model"
                            @click="$nextTick(() => $refs.formulaEditor.formula = $refs.selectFormula.selection.formula)">
                            {{i18n('Obraty')}}
                        </button>
                    </div>
                </div>

                <div v-if="insuranceLogicVariables.init" class="insurance-logics__vars">
                    <u-table
                        :template="insuranceLogicVariablesTemplate"
                        :table.sync="insuranceLogicVariables.table"
                        ref="insuranceLogicVariablesTable"
                        :scroll="8">
                        <template #actions="{ row }">
                            <button @click="$refs.formulaEditor.insertCell(row.name)"
                                class="button is-small is-table-button is-success">
                                <span class="icon is-small">
                                    <fa icon="plus-square" />
                                </span>
                            </button>
                        </template>
                    </u-table>
                </div>

                <formula-editor ref="formulaEditor"
                    :buttons="buttonsFormulaEditor"
                    :model.sync="data.formula"
                    :class="[{ 'is-danger': errors.has('formula') }]"
                    @input="errors.clear('formula')"/>
                <div class="insurance-logics__btns level-right">
                    <button class="button is-success has-margin-left-small"
                        @click="$emit('save-insurance-logics')">
                        {{i18n('save')}}
                    </button>
                </div>
            </template>
        </component-validation>
        <div v-if="evaluate.init" class="insurance-logics__item evaluate">
            <h3 class="title is-5">{{ i18n('Blok testuvannya') }} <b>{{evaluate.insurance_reference}}</b></h3>
            <div class="insurance-logics__btns level-left">
                <button class="button is-info"
                    @click="getEvaluateForLocals()">
                    {{i18n('Protestuvaty')}}
                </button>
            </div>
            <div class="insurance-logics__block columns">
                <div class="insurance-logics__left column is-6">
                    <u-table
                        :template="evaluateTemplate"
                        :table.sync="evaluate.table"
                        :scroll="8"
                        ref="evaluate"
                    />
                </div>
                <div class="insurance-logics__right column is-6">
                    <article :class="['message', evaluate.result.status === 'success' ? 'is-success' : 'is-danger']">
                        <div v-if="evaluate.result.status === 'success'"
                            class="message-body">
                            <p>{{i18n('Perevirka strahovi logiki proshla uspeshno')}}</p>
                            <p>{{i18n('Vyrazhennya')}}: <strong class="info">{{evaluate.result.frozenFormula}}</strong></p>
                            <p class="has-margin-top-medium">{{i18n('Rezultat')}}: <strong class="success">{{evaluate.result.result}}</strong></p>
                        </div>
                        <div v-else-if="evaluate.result.status === 'error'" class="message-body">
                            {{i18n(evaluate.result.message)}}
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import buttonsFormulaEditor from './templates/buttonsFormulaEditor'
import insuranceLogicVariablesTemplate from './templates/insuranceLogicVariablesTemplate'
import evaluate from './templates/evaluate'

import ElementValidation from '@components/validations/ElementValidation'
import ComponentValidation from '@components/validations/ComponentValidation'

import FormulaEditor from './FormulaEditor'
import UTable from '@components/UTable'
import { VueSelect } from '@enso-ui/select/bulma'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        ElementValidation,
        ComponentValidation,
        FormulaEditor,
        UTable,
        VueSelect,
    },

    mixins: [
        buttonsFormulaEditor,
        insuranceLogicVariablesTemplate,
        evaluate,
        errorHandler,
    ],

    inject: ['i18n'],

    props: {
        dataOriginal: {
            type: Object,
            default: null,
        },
        errors: {
            type: Object,
        }
    },

    data() {
        return {
            init: false,
            data: {
                id: null,
                code: '',
                name: '',
                description: '',
                formula: '',
                insuranceLogicVariablesTable: [],
            },
            selectFormula: {
                model: null,
            },
            insuranceLogicVariables: {
                init: false,
                table: [],
            },
            evaluate: {
                init: false,
                table: [],
                insurance_reference: '',
                result: {
                    status: '',
                    message: '',
                    frozenFormula: '',
                    message: '',
                }
            }
        }
    },

    mounted() {
        this.getInsuranceLogicVariables();

        if (this.dataOriginal) this.data = this.dataOriginal;

        if (this.$route.query.insurance_reference) {
            this.evaluate.insurance_reference = this.$route.query.insurance_reference;
            this.getEavaluateForTest(this.$route.query);
        } else {
            this.setEvaluate();
        }

        this.init = true;
    },

    methods: {
        setEvaluate(evaluateTable = []) {
            if (this.data.insuranceLogicVariablesTable.length === 0) return;

            this.data.insuranceLogicVariablesTable.forEach((item, index) => {
                if (item.alias === 'result') return;

                evaluateTable.push({
                    name: item.name.substring(1),
                    user_value: 0,
                    result_calculat: null,
                });
            });
            this.evaluate.table = evaluateTable;
            if (this.evaluate.table.length > 0) this.evaluate.init = true;
        },
        getInsuranceLogicVariables() {
            axios.get('/api/references/insuranceLogicVariables/selectOptions?paginate=-1')
                .then(({ data }) => {
                    this.insuranceLogicVariables = {
                        init: true,
                        table: data,
                    }
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getEvaluateForLocals(locals = {}) {
            this.evaluate.table.forEach((item) => {
                locals[item.name] = item.user_value;
            });
            this.getEvaluate(locals);
        },
        getEavaluateForTest(locals) {
            delete locals.insurance_reference;
            delete locals.result;

            this.evaluate.table = Object.keys(locals).map((name, index) => {
                return {
                    name: name,
                    user_value: locals[name],
                    result_calculat: locals[name],
                }
            });

            this.getEvaluate(locals);
        },
        getEvaluate(locals) {
            axios.get(route('administration.insuranceLogics.evaluate'), {
                    params: {
                        insurance_logic_id: this.$route.params.insuranceLogic,
                        locals: locals,
                    }
                })
                .then(({ data }) => {
                    this.evaluate.init = true;

                    if (data.status === "success") {
                        this.evaluate.result.status = "success",
                        this.evaluate.result.frozenFormula = data.frozenFormula,
                        this.evaluate.result.result = data.result,

                        Object.keys(data.locals).forEach((name) => {
                            let index = this.evaluate.table.findIndex((item) => item.name === name);
                            if (index >= 0) this.evaluate.table[index].result_calculat = data.locals[name];
                        });

                        this.$nextTick(() => this.$el.querySelector('.evaluate')
                            .scrollIntoView({ behavior: 'smooth', block: 'center' }))
                    } else if (data.status === "error") {
                        this.evaluate.result.status = "error";
                        this.evaluate.result.message = data.message;
                    }
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
}
</script>

<style lang="sass">
    .insurance-logics
        &__btns
            margin-top: 2rem
        &__block
            padding-top: 1.5rem
            .utable
                margin-top: -3.8rem
            .textarea
                pointer-events: none

        .message
            box-shadow: inset 0 0 10px -2px rgba(160, 160, 160, 0.1)
            &-body
                border-radius: 4px
                border-style: solid
                border-width: 0 0 0 4px
                color: #4a4a4a
                padding: 1.25em 1.5em
                .info
                    white-space: pre-line
        &__head
            &.columns
                margin-bottom: 0
        &__vars
            margin-bottom: 3rem
        &__input
            margin-top: .5em
        .utable
            .search-filter .column
                margin: 0 0 0 auto

    .insurance-logics__item
        padding: 2rem 24px 2.5rem
        margin: 0 -14px
        transition: .5s
        &:first-of-type
            padding-top: 0
        &:nth-of-type(2n)
            box-shadow: inset 0 0 10px -2px rgba(8, 8, 8, 0.2)
            background-color: rgba(235, 235, 235, 0.1)
            &:last-of-type
                box-shadow: inset 0 10px 10px -2px rgba(2, 2, 2, 0.08), inset 0 -10px 10px 2px rgb(255, 255, 255)
        .title
            &.is-5
                font-size: 1.15rem
                b
                    margin-left: .3rem
                    font-size: 1.3rem
        .label
            font-size: .8rem
</style>

