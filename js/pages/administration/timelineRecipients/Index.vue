<template>
    <div class="administer-message box has-padding-large animated fadeIn">
        <div class="administer-message-block">
            <u-table
                :template="timelineRecipientsTemplate"
                :table.sync="data.policyData"
                ref="timelineRecipientsTable">
                <template #rowToAdd_timeline_activity_event_type_id="{ rowToAdd, column }">
                    <vue-select
                        v-model="rowToAdd.timeline_activity_event_type_id.value"
                        :i18n="i18n"
                        :pivotParams="{
                            policies: {
                                timeline_activity_entity_id: rowToAdd.timeline_activity_entity_id.value,
                            },
                        }"
                        @selection="rowToAdd.timeline_activity_event_type_id.selection = $event"
                        :disabled="!rowToAdd[column.refDisabled].value"
                        v-bind="column.props"/>
                </template>
                <template #rowToAdd_timeline_activity_user_presets="{ rowToAdd, column }">
                    <vue-select
                        v-model="rowToAdd.timeline_activity_user_presets.value"
                        :i18n="i18n"
                        :pivotParams="{
                            policies: {
                                timeline_activity_entity_id: rowToAdd.timeline_activity_entity_id.value,
                                timeline_activity_event_type_id: rowToAdd.timeline_activity_event_type_id.value,
                            },
                        }"
                        @selection="rowToAdd.timeline_activity_user_presets.selection = $event"
                        :disabled="!rowToAdd[column.refDisabled].value"
                        v-bind="column.props"/>
                </template>
            </u-table>
        </div>

        <div class="level-right">
            <button class="button is-success"
                @click="save()">
                {{ i18n('Zberehty') }}
            </button>
        </div>
    </div>
</template>

<script>
import UTable from '@components/UTable'
import { VueSelect } from '@enso-ui/select/bulma'
import timelineRecipients from '@pages/administration/timelineRecipients/templates/timelineRecipients'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        UTable,
        VueSelect,
    },

    inject: ['i18n'],

    mixins: [
        timelineRecipients,
        errorHandler,
    ],

    data() {
        return {
            data: {
                policyData: [],
            }
        }
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            axios.get(route('administration.timelineRecipients.getData'))
                .then(({data}) => {
                    this.data = data;

                    this.$nextTick(() => this.$refs.timelineRecipientsTable.convertMultipleStructure());
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },

        save() {
            axios.post(route('administration.timelineRecipients.saveData'), {
                    policyData: this.data.policyData,
                })
                .then(({ data }) => {
                    this.$toastr.success(this.i18n(data.message));

                    this.fetch();
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        }
    }
};
</script>

<style lang="sass">
    .administer-message
        &-block
            padding-bottom: 2.5rem
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

</style>
