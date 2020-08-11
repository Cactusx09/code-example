<template>
    <div>
        <div v-if="stateEdit"
            class="print_form__editor column">
            <ace-editor v-model="modelContent"
                @init="editorInit()"
                @input="refreshPDF()"
                lang="ace/mode/javascript"
                theme="ace/theme/monokai"
                width="100%"
                height="100%"
                ref="editor"/>
        </div>
        <div class="print_form__viewer column" :style="stateEdit ? 'width: 100%' : ''">
            <iframe frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
import AceEditor from '@components/Ace.vue'

import * as pdfMake from "pdfmake/build/pdfmake"
import * as pdfFonts from "pdfmake/build/vfs_fonts"
pdfMake.vfs = pdfFonts.pdfMake.vfs

import moment from 'moment'

import { errorHandler, footer, watermark } from '@components/pdfEditor/Templates'
import AmountInWords from '@components/pdfEditor/AmountInWords'

let variables = {};
let controlVisible = false;

export default {
    props: {
        editorContent: {
            type: String,
            required: true
        },
        variables: {
            type: Object,
            default: () => ({}),
        },
        stateEdit: {
            type: Boolean,
            default: false,
        },
        isWatermarked: {
            type: Boolean,
            default: false,
        },
        hiddenVariables: {
            type: Boolean,
            default: false,
        }
    },

    components: { AceEditor },

    data() {
        return {
            modelContent: '',
            viewerContent: '',
            controlVisible: !this.isWatermarked && this.hiddenVariables,
        }
    },

    mounted() {
        this.modelContent = this.editorContent;
        this.refreshPDF();

        controlVisible = this.controlVisible;
    },

    watch: {
        editorContent(content) {
            if (this.modelContent !== content){
                this.modelContent = content;
                this.refreshPDF();
            }
        },
        variables: {
            handler(value) {
                variables = value;
            },
            immediate: true,
        },
    },

    methods: {
        editorInit() {
            require('brace/ext/language_tools');
            require('brace/mode/javascript');
            require('brace/theme/monokai');
        },

        refreshPDF: _.debounce(function() {
            const pdfDocGenerator = pdfMake.createPdf(this.getDocDefinition());

            pdfDocGenerator.getDataUrl((dataUrl) => {
                const iframe = document.querySelector('.print_form__viewer iframe');
                iframe.src = dataUrl;
            });

            this.$emit('input');
        }, 600),

        getDocDefinition() {
            this.$emit('update:editorContent', this.modelContent);

            this.viewerContent = this.modelContent;
            let fixedContent = this.viewerContent.replace(/^.+{/g, '{');
            let docDefinition;

            try {
                docDefinition = eval(`(${fixedContent})`);
            } catch (error) {
                return errorHandler(error);
            }

            if (!docDefinition.footer) {
                docDefinition.footer = footer;
            };

            if (this.isWatermarked) {
                docDefinition.watermark = watermark;
            };

            return docDefinition;
        },

        printDocument() {
            pdfMake.createPdf(this.getDocDefinition()).print({}, window);
        },

        downloadDocument() {
            pdfMake.createPdf(this.getDocDefinition()).download();
        },
    }
}

const $text = ((key) => {
    if (variables[key] != null) {
        return variables[key];
    }

    return controlVisible ? '' : { text: `#${key}`, color: 'red' };
});

const $array = ((key) => {
    if (variables[key]) {
        return variables[key];
    }

    return controlVisible ? [] : [{ text: `#${key}`, color: 'red' }];
});

const $manual = ((name = '') => {
    const draft = {
        text: name,
        background: 'black',
        color: 'yellow',
    }

    return controlVisible ? name : draft;
});

const $date = ((key = '', format = 'DD.MM.YYYY', type = ['DD.MM.YYYY HH:mm', 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]']) => {
    if (variables[key]) {
        return moment(variables[key], type).format(format);
    }

    return controlVisible ? '' : { text: `#${key}`, color: 'red' };
});

const $amountInWords = ((key) => {
    if (variables[key]) {
        return !isNaN(variables[key]) ? AmountInWords(Number(variables[key])) : { text: variables[key], color: 'red' };
    }

    return controlVisible ? '' : { text: `#${key}`, color: 'red' };
});

const $ul = ((key = '', label = 'name') => {
    if (variables[key]) {
        return Object.values(variables[key]).map((item, index) => {
            return {
                text: [
                    typeof item !== 'string' ? item[label] : item,
                    index < Object.keys(variables[key]).length - 1 ? '; ' : '. ',
                ]
            }
        });
    }

    return controlVisible ? [] : [{ text: `#${key}`, color: 'red' }];
});

const $table = ((tableKey, body = {}, widths = {}) => {
    let finish = {};
    let constantLength;

    const dataTable = variables[tableKey] || [{}];

    const defineConstantLength = ((length) => {
        constantLength = length + dataTable.length;
    });

    const arrayBody = Object.keys(body).map((name) => {
        return {
            name: name,
            visible: body[name].reqPresence ? dataTable.some((row) => row[name]) : true,
        }
    });

    arrayBody.forEach((item) => {
        if (!item.visible) {
            return;
        }

        finish[item.name] = [];

        (() => {
            const cells = Object.keys(body[item.name].content);

            if (!constantLength) {
                defineConstantLength(cells.length)
            }

            for (let key of cells) {
                let cell = body[item.name].content[key];

                if (cell.colSpan || cell.colSpan === 0) {
                    cell.colSpan = constantLength + cell.colSpan;
                }

                if (cell.rowSpan) {
                    cell.rowSpan = arrayBody.slice(
                            arrayBody.findIndex((from) => from.name === item.name),
                            (arrayBody.findIndex((to) => to.name === cell.rowSpan) + 1),
                        )
                        .filter((item) => item.visible).length;
                }

                finish[item.name][key] = cell;
            }
        })();

        (() => {
            let columnIndex = 0;

            dataTable.forEach((row) => {
                while (finish[item.name][columnIndex]) {
                    columnIndex++;
                }

                let text;

                if (row[item.name]) {
                    text = Array.isArray(row[item.name]) ? row[item.name].join(', ') : row[item.name];
                } else {
                    text = controlVisible ? '-' : `#${item.name}`;
                }

                finish[item.name][columnIndex] = {
                    text: text,
                    color: !row[item.name] && !controlVisible ? 'red' : 'auto',
                    ...body[item.name].style,
                };
            });
        })();
    });

    return {
        widths: Array.from({ length: constantLength }, (el, index) => widths[index] || '*'),
        body: Object.values(finish),
    };
});

class PdfTable {
    constructor(data = [{}]) {
        this.variables = data.reduce((variables, item) => {
            Object.entries(item).forEach(([key, value]) => {
                variables[key] = [...variables[key] || [], value];
            });

            return variables;
        }, {});

        this.data = data;
        this.length = data.length;
        this.widths;
        this.emptyColumn = Array.from({ length: this.length }, (item, index) => index);
    }

    buildCell(values, options = {}) {
        const { value, valid } = this.validate(...values);
        if (!valid) return value;

        const { after, before, defaultValue, ...style } = options;

        const text = (before || '') + (value || defaultValue || '-') + (after || '');

        return { text, ...style };
    }

    fillCell(key, options = {}) {
        return this.emptyColumn.map(index => this.buildCell([key, index], options));
    }

    getRow(callback) {
        return this.data.map((item, index) => {
            return callback(this.data[index], index);
        });
    }

    fillRow(row, isPresent = true) {
        let filledRow = [];

        const defType = (prop) => {
            const propType = typeof prop;

            if (prop == null || propType === 'boolean') {
                throw new Error('Тип параметра в fillRow обов\'язково повинен бути number, string або array')
            }

            if (propType === 'number') {
                return Array.from({ length: prop }, () => '');
            }

            if (propType === 'object') {
                return prop;
            }

            if (propType === 'string') {
                return [prop];
            }
        }

        for (let prop of row) {
            filledRow = [...filledRow, ...defType(prop)];
        }

        if (filledRow.length !== this.widths.length) {
            throw new Error(`Кількість колонок в таблиці обов\'язково повинно бути ${this.widths.length}`)
        }

        return (isPresent)
            ? filledRow
            : this.widths.map(() => ({ text: '', border: [false] }))
    }

    levelWidth(templateWidth = []) {
        const proc = value => `${value}%`;
        const remainder = templateWidth.reduce((result, numb) => (result -= numb), 100);

        const columnWidth = remainder / this.length;
        const length = this.length + templateWidth.length;

        this.widths = Array.from({ length }, (item, index) => proc(templateWidth[index] || columnWidth));

        return this.widths;
    }

    sum(row) {
        return row.reduce((result, numb) => result += Number(numb) || 0, 0)
    }

    validate(key, index) {
        if (!this.variables[key]) {
            const value = !controlVisible ? { text: `#${key}`, color: 'red' } : '';
            return { value };
        }

        return {
            value: this.variables[key][index],
            valid: true,
        };
    }

    // render(callback) {
    //     return callback({
    //         data: this.data,
    //         length: this.length,
    //         fillRow: (row) => this.fillRow(row),
    //         fillCell: this.fillCell,
    //         calcRow: this.calcRow,
    //         levelWidth: this.levelWidth
    //     })
    // }
};

</script>

<style lang="sass">
.print_form
    &__editor
        position: relative
        .ace_editor
            height: 100%
            width: 100%
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
