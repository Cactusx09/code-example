<template>

    <div class="columns is-centered">
        <div class="column is-three-quarters">
            <enso-form class="box animated fadeIn">
                <template #printingForms="{ field, errors }">
                    <component-validation :label="field.label"
                        :name="'printingForms'"
                        :errors="errors"
                        :labelClass="'label'">
                        <div class="columns">
                            <div class="column field is-4-fullhd is-7-widescreen is-10-desktop is-12-tablet is-12-mobile">
                                <u-search :api-url="'/api/dynamicsearch/administration/printingForms/initUTable'"
                                    :table-search.sync="search"
                                    :min-length="3"
                                    checkbox
                                    @accept="
                                        field.value = _.uniqBy([...field.value, ...$event], 'dtRowId');
                                        search = '';
                                        errors.clear('productNextPeriodTable');
                                    "
                                    @cancel="search = ''">
                                    <div class="control has-icons-left has-icons-right">
                                        <u-input
                                            type="text"
                                            v-model="search"
                                            :placeholder="i18n('Universalnyy poshuk po nazvi prohramy strakhuvannya, Kodu abo nazvi produktu')"></u-input>
                                        <span class="icon is-small is-left">
                                            <fa icon="search"/>
                                        </span>
                                    </div>
                                </u-search>
                            </div>
                        </div>

                        <u-table
                            v-if="field.value.length > 0"
                            :template.sync="productUTableTemplate"
                            :table.sync="field.value"
                            :scroll="5">
                        </u-table>
                    </component-validation>
                </template>
            </enso-form>
        </div>
    </div>

</template>

<script>

import { EnsoForm } from '@enso-ui/forms/bulma'

import UTable from '@components/UTable'
import USearch from '@components/USearch'
import UInput from '@components/UInput'

import PrintingFormsTable from '@pages/administration/additionalAgreementTypes/templates/PrintingFormsTable'

import ComponentValidation from '@components/validations/ComponentValidation'

export default {
    components: {
        EnsoForm,
        UTable,
        USearch,
        UInput,
        ComponentValidation,
    },

    inject: ['i18n'],

    mixins: [PrintingFormsTable],

    data() {
        return {
            search: null,
        }
    },
};

</script>
