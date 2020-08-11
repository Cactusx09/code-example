<template>
    <div>
        <enso-table
            class="car-cost box is-paddingless raises-on-hover"
            :path="path"
            id="carCost"
            ref="carCost"
            @edit="
                insuranceObject = $event;
                show = true;
            "
            @fetching="ready = false"
            @fetched="ready = true"
        >
            <template #consultation_id="props">
                <router-link
                    :to="{
                        name: 'inwork.consultation.edit',
                        params: {
                            consultation: props.row.consultation_id
                        },
                    }"
                    target="_blank">
                    {{ props.row.consultation_id }}
                </router-link>
            </template>
        </enso-table>
        <edit
            v-if="show"
            :insurance-object="insuranceObject"
            @close="show = false"
            @save="$refs.carCost.fetch()"
        />
    </div>
</template>

<script>

    import { EnsoTable } from '@enso-ui/tables/bulma';
    import Edit from '@pages/administration/carCostEstimateRequests/Edit';

    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

    library.add(faExternalLinkAlt)

    export default {
        components: { EnsoTable, Edit },

        data() {
            return {
                path: route('administration.carCostEstimateRequests.initTable'),
                show: false,
                insuranceObject: null,
                ready: false,
            };
        },

        computed: {
            dataTable() {
                return this.ready && this.$refs.carCost.body.data;
            },
        },

        methods: {
            setHighlight() {
                this.$refs.carCost.clearHighlighted();

                this.dataTable.forEach((item) => {
                    if (!!item.expert_cost) this.$refs.carCost.highlight(item.dtRowId);
                });
            },
        },

        watch: {
            'dataTable.length'(dataLength) {
                if (dataLength > 0) {
                    this.setHighlight();
                }
            }
        },
    };

</script>

<style lang="sass">
    .car-cost table
        th,
        td,
        li.child-row:not(:last-child)
            border-color: #a7a7a7
        tbody tr
            background: rgba(231, 76, 60, 0.4) !important
            &.has-background-info
                background: rgba(35, 209, 96, 0.4) !important
                & + tr td[colspan="20"]
                    background: rgb(167, 237, 191)
            td.center span
                display: flex
                justify-content: center
            
</style>
