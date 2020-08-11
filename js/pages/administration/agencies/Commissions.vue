<template>
    <div class="commission box has-padding-large animated">
        <div class="commission-block">
            <div class="level">
                <div class="level-left">
                    <h3 class="title is-5">{{ i18n('Bazova komisiia') }}</h3>
                </div>
                <div class="level-right">
                    <div class="buttons has-addons">
                        <div class="button is-outlined has-text-dark is-static">
                            <b>{{ i18n('Vsoho') }}:</b>
                        </div>
                        <div class="button ">
                            <b>{{ resultBaseCommissions.toFixed(2) }}%</b>
                        </div>
                        <div :class="['button', resultBaseCommissions === 100 ? 'is-primary' : 'is-warning']">
                            <span class="icon">
                            <fa :icon="resultBaseCommissions === 100 ?  'check' : 'exclamation-triangle'"/>
                        </span>
                        </div>
                    </div>
                </div>
            </div>

            <u-table
                :template.sync="baseCommissionsTemplate"
                :table.sync="data.baseCommissionsTable"
                :scroll="5"
            />
        </div>

        <div class="commission-block">
            <h3 class="title is-5">{{ i18n('Korehuvannia komisii') }}</h3>
            <u-table
                :template.sync="commissionCorrectionsTemplate"
                :table.sync="data.commissionCorrectionsTable"
                :scroll="5"
            />
        </div>

        <div class="commission-btn">
            <div class="level-right">
                <div class="level-item">
                    <button
                        class="button is-success"
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

    import BaseCommissions from '@pages/administration/agencies/templates/BaseCommissions.js'
    import CommissionCorrections from '@pages/administration/agencies/templates/CommissionCorrections.js'

    import UTable from '@components/UTable.vue'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
    library.add(faCheckCircle, faExclamationTriangle);

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            UTable,
        },

        inject: ['i18n'],

        mixins: [
            BaseCommissions,
            CommissionCorrections,
            errorHandler,
        ],

        data() {
            return {
                agencyId: Number(this.$route.params.agency),
                data: {
                    commissionCorrectionsTable: [],
                    baseCommissionsTable: [],
                },
                errors: new Errors(),
            };
        },

        computed: {
            resultBaseCommissions() {
                return this.data.baseCommissionsTable
                    .reduce((previousValue, current) => previousValue + Number(current.value), 0);
            },
        },

        created() {
            this.fetch();
        },

        methods: {
            fetch() {
                axios.get(route('administration.agencies.commissions.getData'), {
                        params: {
                            'agency_id': this.agencyId,
                        }
                    })
                    .then(({ data }) => {
                        this.data.baseCommissionsTable = data.fields.baseCommissionsTable;
                        this.data.commissionCorrectionsTable = data.fields.commissionCorrectionsTable;
                    })
                    .catch((error) => {
                        this.errorHandler(error, { setErrorsFlag: true });
                    });
            },

            save() {
                axios.post(route('administration.agencies.commissions.saveData'), {
                        'agency_id': this.agencyId,
                        ...this.data,
                    })
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                    })
                    .catch((error) => {
                        this.errorHandler(error, { setErrorsFlag: true });
                    });
            },
        },
    };

</script>

<style lang="sass" scoped>
    .commission
        margin-bottom: 80px
        &-block
            padding-bottom: 2.5rem
            padding-top: 2rem
            margin-left: -0.8em
            padding-left: 1.5rem
            margin-right: -0.8em
            padding-right: 1.5rem
            transition: .5s
            &:nth-of-type(2n)
                box-shadow: inset 0 0 10px -2px hsla(0,0%,3%,.2)
                background-color: rgba(235, 235, 235, .1)
            &:first-of-type
                padding-top: .5em
            .buttons
                width: 100%
                .is-outlined
                    pointer-events: none
                .button
                    &:first-of-type
                        margin-left: auto
                    &:last-of-type
                        cursor: default
                        user-select: all
        &-btn
            padding-top: .8rem
</style>
