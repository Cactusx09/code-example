<template>

    <div class="container-fluid is-fullheight">

        <div class="box">
            <div class="columns">
                <div class="column is-3-fullhd is-4-widescreen is-4-desktop is-5-tablet is-12-mobile">
                    <div class="label">
                        <b>{{ i18n('Pidtyp produktu') }}</b>
                    </div>
                    <vue-select
                        v-model="filters.product_subtypes.id"
                        :source="route('administration.productSubtypes.selectOptions')"
                        :placeholder="i18n('Vyberit pidtyp produktu')"
                    />
                </div>

                <div class="column is-3-fullhd is-4-widescreen is-4-desktop is-5-tablet is-12-mobile">
                    <div class="label">
                        <b>{{ i18n('Prohrama strakhuvannya') }}</b>
                    </div>
                    <vue-select
                        v-model="filters.insurance_products.insurance_program_id"
                        :pivot-params="insuranceProgramParams"
                        :source="route('administration.insurancePrograms.selectOptions')"
                        :placeholder="i18n('Vyberit prohramu')"
                    />
                </div>

                <div class="column is-3-fullhd is-4-widescreen is-4-desktop is-5-tablet is-12-mobile">
                    <div class="label">
                        <b>{{ i18n('Pokazaty kotyrovani produkty') }}</b>
                    </div>
                    <vue-switch
                        v-model="quoted"
                        size="is-large"
                        type="is-success"
                        @input="getQuoted($event)"
                    />
                </div>
            </div>
        </div>

        <custom-enso-table
            :filters="filters"
            :path="path"
            :edit="{
                name: 'administration.insuranceProducts.edit',
                params: {
                    insuranceProduct: 'dtRowId',
                },
            }"
            ref="customTable"
            @product_code="getQuoted($event)"
            id="insuranceProducts">
            <template #product_notice="{ row }">
                <p>{{ `${row.product_notice.substr(0, 50)}${row.product_notice.length > 50 ? '...' : ''}` }}</p>
            </template>

            <template #activity_status="{ row, column, selected }">
                <div
                    :class="[
                        'is-small is-table-button is-row-button',
                        selected[column.data] ? 'is-clickable' : 'button',
                    ]"
                    @click="$refs.customTable.getFilter({ row, column })">
                    <span
                        :class="[
                            'tag is-table-tag icon is-small',
                            !!row.activity_status ? 'is-success' : 'is-danger',
                        ]">
                        <fa :icon="!!row.activity_status ? 'check' : 'times'"/>
                    </span>
                </div>
            </template>
        </custom-enso-table>
    </div>
</template>

<script>

import CustomEnsoTable from '@components/CustomEnsoTable';
import { VueSelect } from '@enso-ui/select/bulma';
import VueSwitch from '@enso-ui/switch/bulma';

export default {
    components: { CustomEnsoTable, VueSelect, VueSwitch },

    inject: ['i18n'],

    data() {
        return {
            path: route('administration.insuranceProducts.initTable'),
            filters: {
                product_types: {
                    id: null,
                },
                product_subtypes: {
                    id: null,
                },
                insurance_products: {
                    insurance_program_id: null,
                    is_quoted: false,
                },
            },
            quoted: false,
        };
    },

    computed: {
        insuranceProgramParams() {
            const productSubtypeId = this.filters.product_subtypes.id;

            if (productSubtypeId) {
                return {
                    productSubtype: {
                        'id':  productSubtypeId,
                    }
                };
            }

            return null;
        },
    },

    methods: {
        getQuoted(flag) {
            if (this.quoted !== flag) {
                if (flag) {
                    this.quoted = true;
                    this.$toastr.info('Poshuk z kotyrovanymy produktamy po kodu');
                } else {
                    this.quoted = false;
                }
            }

            this.filters.insurance_products.is_quoted = flag ? null : false
        }
    }
};

</script>
