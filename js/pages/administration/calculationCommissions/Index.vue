<template>
    <div>
        <div class="columns">
            <div class="switch-actual-policy column is-narrow">
                <label class="label">{{ i18n(' Aktualni polityky') }}</label>
                <vue-switch
                    v-model="actualPolicy"
                    @click="actualPolicy = !actualPolicy"
                    class="has-margin-left-large is-medium is-info"
                />
            </div>
        </div>
        <custom-enso-table
            class="box is-paddingless raises-on-hover"
            :path="route('administration.calculationCommissions.initTable')"
            :filters="actualPolicy ? filters : null"
            id="calculationCommissions"
            ref="calculationCommissions"
        >
            <template #actions="props">
                <div class="action-buttons">
                    <router-link
                        :to="{
                            name: 'administration.calculationCommissions.edit',
                            params: {
                                calculationCommission: props.row.calculation_commission_id,
                            }
                        }"
                        class="button is-small is-table-button is-row-button">
                        <span class="icon is-small"><fa class="fa" icon="pencil-alt"/></span>
                    </router-link>
                </div>
            </template>
        </custom-enso-table>

        <confirm-modal
            :visible="destroyRowId"
            title="The selected record is about to be deleted. Are you sure?"
            @submit="destroy()"
            @cancel="destroyRowId = null"
        ></confirm-modal>
    </div>

</template>

<script>

    import CustomEnsoTable from '@components/CustomEnsoTable'
    import ConfirmModal from '@components/ConfirmModal'
    import VueSwitch from '@enso-ui/switch/bulma'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            CustomEnsoTable,
            ConfirmModal,
            VueSwitch,
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                destroyRowId: null,
                actualPolicy: true,
                filters: {
                    calculation_commissions: {
                        deactivated_at: null,
                    },
                },
            };
        },

        methods: {
            destroy() {
                axios.delete(route('administration.calculationCommissions.destroy', this.destroyRowId))
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));
                        this.$refs.calculationCommissions.fetch();
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    })
                    .finally(() => {
                        this.destroyRowId = null;
                    });
            },
        },
    };

</script>

<style lang="sass">
.switch-actual-policy
    display: flex
    justify-content: center
    .label
        margin-bottom: 0
.table
    &-header
        position: relative
        &:not(.has-text-left)
            .is-clickable
                display: inline-block
                max-width: 2vw
                white-space: nowrap
                overflow: hidden
                text-overflow: ellipsis
            .has-tooltip
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                svg
                    display: none
</style>
