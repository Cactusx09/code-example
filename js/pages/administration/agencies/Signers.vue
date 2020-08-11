<template>

	<div v-if="init"
        class="user box has-padding-large animated fadeIn">
        <div class="user-block">
            <u-table
                :template="signerTemplate"
                :table.sync="data.signerTableData"
                ref="signerTable"
                :scroll="false">
                <!-- @add-row="getUserSignsInfo($refs.signerTable.rowToAdd.user_sign_id.selection)"> -->

                <template #rowToAdd_user_sign_id="{ rowToAdd, column }">
                    <vue-select
                        v-model="rowToAdd.user_sign_id.value"
                        :i18n="i18n"
                        :params="{
                            user_id: rowToAdd.user_id.value,
                        }"
                        @selection="rowToAdd.user_sign_id.selection = $event"
                        :disabled="!rowToAdd[column.refDisabled].value"
                        v-bind="column.props"/>
                </template>

                <template v-slot:[`tr_${editIndex}`]="{ index }">
                    <row-to-add
                        :template-data="$refs.signerTable.templateData"
                        :key="editIndex"
                        @add="acceptRow($event)"
                        ref="rowToAdd">
                        <template #rowToAdd_user_sign_id="{ rowToAdd, column }">
                            <vue-select
                                v-model="rowToAdd.user_sign_id.value"
                                :i18n="i18n"
                                :params="{
                                    user_id: rowToAdd.user_id.value,
                                }"
                                @selection="rowToAdd.user_sign_id.selection = $event"
                                :disabled="!rowToAdd[column.refDisabled].value"
                                v-bind="column.props"/>
                        </template>

                        <template #addButton="{ rowToAdd, disabled }">
                            <button
                                v-if="editIndex === index"
                                :key="'save'"
                                :disabled="disabled"
                                class="button is-small is-table-button is-success"
                                @click="$refs.rowToAdd.addRow()">
                                <span class="icon is-small"><fa icon="check"/></span>
                            </button>
                            <button
                                v-if="editIndex === index"
                                :key="'cancel'"
                                class="button is-small is-table-button is-light"
                                @click="editIndex = null">
                                <span class="icon is-small"><fa icon="times"/></span>
                            </button>
                        </template>
                    </row-to-add>
                </template>

                <template #actions="{ index }">
                    <button
                        :key="'edit'"
                        class="button is-small is-table-button is-warning"
                        :disabled="!!editIndex"
                        @click="editRow(index)">
                        <span class="icon is-small">
                            <fa icon="pen"></fa>
                        </span>
                    </button>
                </template>

                <!--
                <template #user_sign_name="{ row, index }">
                    <div class="user-sign-name">
                        <vue-select
                            v-if="original.editRows.indexOf(row.user_sign_event_id) > -1"
                            v-model="row.user_sign_id"
                            :params="{'user_id': row.user_id}"
                            :source="route('references.userSigns.selectOptions')"
                            :placeholder="i18n('Oberit pidpys')"
                            :ref="`userSignsIndex${row.user_sign_event_id}`"
                            disable-clear
                            @input="selectionUserSigns(row.user_sign_event_id, index)"
                        />

                        <span v-else
                            class="input"
                            disabled>
                            {{ row.user_sign_name }}
                        </span>

                        <div :class="[
                                'message is-small',
                                (row.sign_basis || row.sign_genitive || row.sign_nominative) ? 'is-info' : 'is-danger'
                            ]">
                            <div class="message-body">
                                <div class="field has-text-left">
                                    <label class="label is-small">{{ i18n('Posada, PIB u nazyvnomu vidminku') }}</label>
                                    <div :class="[
                                            'field-body is-small',
                                            { 'is-danger': row.sign_nominative }
                                        ]">
                                        {{ row.sign_nominative || '___' }}
                                    </div>
                                </div>

                                <div class="field has-text-left">
                                    <label class="label is-small">{{ i18n('Posada, PIB u rodovomu vidminku') }}</label>
                                    <div :class="['field-body is-small',
                                        { 'is-danger': row.sign_genitive }]">
                                        {{ row.sign_genitive || '___' }}
                                    </div>
                                </div>

                                <div class="field has-text-left">
                                    <label class="label is-small">{{ i18n('Diie na pidstavi') }}</label>
                                    <div :class="['field-body is-small',
                                        { 'is-danger': row.sign_basis }]">
                                        {{ row.sign_basis|| '___' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
				</template> -->
            </u-table>
        </div>

        <div class="columns has-margin-top-large">
            <div class="column">
                <div class="level-right">
                    <button class="button is-success"
                        @click="save()">
                        <span class="is-hidden-mobile">{{ i18n('save') }}</span>
                        <span class="icon"><fa icon="check"/></span>
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    import RowToAdd from '@components/RowToAdd'
    import UTable from '@components/UTable'
    import { VueSelect } from '@enso-ui/select/bulma'

    import Signers from '@pages/administration/agencies/templates/Signers.js'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import {
        faPen,
        faCheck,
        faTimes,
    } from '@fortawesome/free-solid-svg-icons'
    library.add(faPen, faCheck, faTimes)

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            UTable,
            RowToAdd,
            VueSelect,
        },

        inject: ['i18n'],

        mixins: [
            Signers,
            errorHandler,
        ],

        props: {
            path: {
                type: String,
                default: 'administration/agencies',
            },
            params: {
                type: String,
                default: 'agency',
            },
        },

        data() {
            return {
                init: false,
                data: {
                    event_id: null,
                    signerTableData: [],
                },
                editIndex: null,
                errors: new Errors(),
            };
        },

        created() {
            this.fetch();
        },

        methods: {
            fetch() {
                axios.get(`/api/${this.path}/signers/getData`, {
                        params: {
                            event_id: this.$route.params[this.params],
                        },
                    })
                    .then(({ data }) => {
                        this.data.event_id = data.event_id;

                        this.signerTemplate.columns.printing_form_types.props.options = data.options.printing_form_types;
                        this.signerTemplate.columns.sign_alias.props.options = data.options.sign_alias;

                        this.data.signerTableData = data.signerTableData;
                        this.init = true;
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
            save(data = this.data) {
                axios.post(`/api/${this.path}/signers/saveData`, data)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            editRow(index) {
                this.editIndex = index;

                Object.entries(this.data.signerTableData[index]).forEach(([key, value]) => {
                    if (this.signerTemplate.columns[key]) {
                        this.signerTemplate.columns[key].default = value;
                    }
                });
            },

            acceptRow(rowToAdd) {
                this.data.signerTableData[this.editIndex] = rowToAdd;
                this.$refs.signerTable.fetch();

                this.editIndex = null;
            },
        },
    };

</script>

<style lang="sass">
    .user
        &-block
            padding-top: 2rem
            margin-left: -24px
            padding-left: 24px
            margin-right: -24px
            padding-right: 24px
            transition: .5s
            &:nth-of-type(2n)
                box-shadow: inset 0 0 10px -2px hsla(0,0%,3%,.2)
                background-color: rgba(235, 235, 235, .1)
            &:first-of-type
                padding-top: .5em

            .title
                &.is-5
                    font-size: 1.2rem
            .text-bounded
                background-color: #f5f5f5
                padding: 1em 16px
                border-radius: 6px
                font-size: .9rem
                font-weight: 300
                margin-bottom: 20px
                margin-top: 20px
                transition: 5s
                display: flex
                align-items: center
                span
                    line-height: 1.4
                i
                    color: #209cee
                    margin-right: .75em

    .user-sign-name
        width: 100%
        .message
            margin-top: .75em
            .message-body
                padding: .75em 1.25em
                .field:not(:last-child)
                    margin-bottom: 0.5rem
                    .label:not(:last-child)
                        margin-bottom: 0.25em
    .printing-form-type-name
        .vue-select.tags .tag
            font-size: 0.9em

</style>
