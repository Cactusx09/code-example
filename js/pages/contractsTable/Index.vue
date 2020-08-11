<template>
    <div>
        <div class="box blanks-box">
            <div class="columns">
                <div class="column is-3">
                    <div class="label">{{ i18n('Typ produktu') }}</div>
                    <vue-select
                        v-model="filters.product_types.id"
                        :source="route('administration.productTypes.selectOptions')"
                        :placeholder="i18n('Vyberit typ produktu')"
                        :i18n="i18n"
                        translated
                        multiple
                    />
                </div>

                <div class="column is-3">
                    <div class="label">{{ i18n('Ahentsiya') }}</div>
                    <vue-select
                        v-model="filters.agencies.id"
                        :source="route('administration.agencies.selectOptions')"
                        :placeholder="i18n('Vyberit ahentsiyu')"
                        :i18n="i18n"
                        translated
                    />
                </div>
            </div>
        </div>

        <custom-enso-table
            :path="path"
            :custom-edit="customEdit"
            :filters="filters"
            id="contractsTable"
        />

    </div>

</template>

<script>

import CustomEnsoTable from '@components/CustomEnsoTable';
import { VueSelect } from '@enso-ui/select/bulma';

export default {
    components: { CustomEnsoTable, VueSelect, },

    inject: ['i18n'],

    data() {
        return {
            path: route('contractsTable.initTable'),
            filters: {
                agencies: {
                    id: [],
                },
                product_types: {
                    id: [1, 4],
                },
            },
        };
    },

    methods: {
        customEdit(row) {
            return row.contractUrl;
        },
    },
};

</script>
