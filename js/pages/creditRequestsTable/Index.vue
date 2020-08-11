<template>
    <div>

        <custom-enso-table
            :path="path"
            :custom-edit="customEdit"
            id="creditRequestsTable"
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
            path: route('creditRequestsTable.initTable'),
        };
    },

    methods: {
        customEdit(row) {
            return row.contractUrl;
        },
    },
};

</script>
