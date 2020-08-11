<template>
    <div>
        <custom-enso-table
            :path="path"
            ref="agencyInsuranceObjectAssignments"
            id="agencyInsuranceObjectAssignments">
            <template #edit="{ row }">
                <button
                    class="button is-small is-table-button is-row-button"
                    @click="objectId = row.objectId">
                    <span class="icon is-small"><fa class="fa" icon="pencil-alt"/></span>
                </button>
            </template>
        </custom-enso-table>

        <edit-agency-insurance-object-assignments
            :object-id="objectId"
            @close="objectId = null"
            @save="$refs.agencyInsuranceObjectAssignments.fetch()"
        />
    </div>
</template>

<script>

import CustomEnsoTable from '@components/CustomEnsoTable';
import EditAgencyInsuranceObjectAssignments from './EditAgencyInsuranceObjectAssignments';

export default {
    components: { CustomEnsoTable, EditAgencyInsuranceObjectAssignments },

    data() {
        return {
            path: route('administration.agencyInsuranceObjectAssignments.initTable'),
            objectId: null,
        };
    },
};
</script>
