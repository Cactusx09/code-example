<template>
    <div class="sales_plan box has-padding-large">
        <div class="sales_plan__item">
            <div class="columns">
                <div class="column field is-12-fullhd is-12-widescreen is-12-desktop is-12-tablet is-12-mobile">
                    <vue-select
                        v-model="selectedSellingPlanType"
                        ref="selectedSellingPlanType"
                        :source="route('references.sellingplantypes.selectOptions')"
                        multiple
                        taggable
                        disable-clear
                        :placeholder="i18n('Dodaty plan prodazhu')"
                        @fetch="dataLoaded($event)"
                        @select="selectItem($event, date.getFullYear())"
                        @deselect="deselectItem($event)"
                    />
                </div>
            </div>
        </div>

        <div
            v-for="(item, key) in items"
            :key="key"
            class="sales_plan__item">
            <h4 class="title is-5">
                {{ item.name }}
            </h4>

            <div class="columns">
                <div class="column field is-2-fullhd is-3-widescreen is-5-desktop is-6-tablet is-12-mobile">
                    <label class="label">{{ i18n('Rik') }}</label>
                    <vue-select
                        v-model="item.year"
                        :options="yearOptions()"
                        disable-clear
                        :placeholder="i18n('Oberit rik')"
                        @select="selectItem(item.id, item.year)"
                        @deselect="deselectItem($event)"
                    />
                </div>

                <div class="column field is-10-fullhd is-9-widescreen is-7-desktop is-6-tablet is-12-mobile">
                    <label class="label">{{ i18n('Misiats') }}</label>
                    <vue-select v-model="item.months"
                        :options="monthsOptions()"
                        multiple
                        disable-clear
                        :placeholder="i18n('Oberit misiatsi')"
                        @select="updateRowMonth(item)"
                        @deselect="updateRowMonth(item)"
                    />
                </div>
            </div>

            <u-table
                v-if="tables[`item_${item.id}`].length > 0"
                :template.sync="sellingPlansTemplate"
                :table.sync="tables[`item_${item.id}`]"
                :ref="`item_${item.id}`"
                :scroll="5"
                @update-model="updateModel">
                <template #period="{ row }">
                    <p>{{ monthFormat(row.period, 'name') }}</p>
                </template>

                <template #fact_pcs="{ row }">
                    <p>{{ row.fact_pcs === null ? row.fact_pcs = 0 : row.fact_pcs }} шт</p>
                </template>

                <template #fact_uah="{ row }">
                    <p>{{ row.fact_uah === null ? row.fact_uah = 0 : row.fact_uah }} грн</p>
                </template>

                <template #procent_pcs="{ row }">
                    <p>{{ row.procent_pcs }} %</p>
                </template>

                <template #procent_uah="{ row }">
                    <p>{{ row.procent_uah }} %</p>
                </template>
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

    import { VueSelect } from '@enso-ui/select/bulma'
    import UTable from '@components/UTable'

    import SellingPlans from '@pages/administration/agencies/templates/SellingPlans.js'

    import { library } from '@fortawesome/fontawesome-svg-core'
    import { faCheck, faTimes, } from '@fortawesome/free-solid-svg-icons'
    library.add([faCheck, faTimes,])

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            VueSelect,
            UTable,
        },

        inject: ['i18n'],

        mixins: [
            SellingPlans,
            errorHandler,
        ],

        data() {
            return {
                date: new Date(),
                items: {},
                tables: {},
                selectedSellingPlanType: [],
                errors: new Errors(),
                optionList: [],
            };
        },

        methods: {
            selectItem(id, year) {
                this.$nextTick(() => this.getData({ id: id, year: year }));
            },
            deselectItem(item) {
                if (!Number.isInteger(item)) item = item.id;

                delete this.items[`item_${item}`];
                delete this.tables[`item_${item}`];
            },
            dataLoaded(optionList) {
                this.optionList = optionList;

                this.$nextTick(() => {
                    this.getData({'id': null, 'year': this.date.getFullYear()});
                });
            },

            getData(params) {
                axios.get(route('administration.agencies.sellingPlans.getData'), {
                    params: {
                            'agency_id': this.$route.params.agency,
                            'selling_plan_type_id': params.id,
                            'year': params.year,
                        }
                    })
                    .then(({ data }) => {
                        let table = data.fields.sellingPlansTable;

                        if (!params.id) {
                            this.optionList.forEach((item, index) => {
                                item.year = this.date.getFullYear();

                                let tableData = table.filter((row, i) => row.selling_plan_type_id === item.id);
                                this.reproduction(item, tableData, true);
                            });

                            return;
                        }

                        this.reproduction(params, table);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            updateRowMonth(item) {
                let table = [];
                item.months.forEach((month) => {
                    let row = item.table.find((row) => this.monthFormat(row.period) === month);
                    if (row) return table.push(row);

                    let row2 = this.tables[`item_${item.id}`].find((row) => this.monthFormat(row.period) === month);
                    if (row2) return table.push(row2);

                    table.push({
                        'selling_plan_type_id': item.id,
                        'selling_plan_type_name': item.name,
                        'period': item.year + '-' + (month > 10 ? month : '0' + month) + '-01',
                        'fact_pcs': 0,
                        'fact_uah': 0,
                        'plan_pcs': 0,
                        'plan_uah': 0,
                        'procent_pcs': 100,
                        'procent_uah': 100,
                        'correction_coefficient': 1,
                        'comment': '',
                    });

                });
                table.sort((a, b) => (a.period > b.period) ? 1 : ((b.period > a.period) ? -1 : 0));

                this.$set(this.tables, [`item_${item.id}`], table);
            },

            updateModel(event) {
                const item = this.tables[`item_${event.row.selling_plan_type_id}`],
                    index = item.findIndex((row) => row.period === event.row.period);

                if (event.column.name === 'plan_pcs') {
                    item[index].procent_pcs = this.procentFormat(event.row.fact_pcs, event.row.plan_pcs) ;
                } else if (event.column.name === 'plan_uah') {
                    item[index].procent_uah = this.procentFormat(event.row.fact_uah, event.row.plan_uah);
                }

                if (event.column.name !== 'correction_coefficient' && event.column.name !== 'comment') {
                    item[index].correction_coefficient = (item[index].procent_pcs/100 + item[index].procent_uah/100) / 2;
                }
            },

            reproduction(item, table, target = false) {
                let months = [];
                let selectedSellingPlanType;

                let tableData = table.map((row) => {
                    selectedSellingPlanType = item.id;
                    months.push(this.monthFormat(row.period));

                    this.$set(row, 'procent_pcs', this.procentFormat(row.fact_pcs, row.plan_pcs));
                    this.$set(row, 'procent_uah', this.procentFormat(row.fact_uah, row.plan_uah));
                    return row;
                });

                if (target) {
                    if (!selectedSellingPlanType) return;

                    this.selectedSellingPlanType.push(selectedSellingPlanType);
                }

                let current = {
                    'id': item.id,
                    'name': item.name,
                    'year': item.year,
                    'table': tableData,
                    'months': months,
                };

                this.$set(this.items, [`item_${item.id}`], current);
                this.updateRowMonth(this.items[`item_${item.id}`]);
            },

            save() {
                let sellingPlansTable = [];
                let domains = [];

                for (let item in this.tables) {
                    domains.push({
                        'selling_plan_type_id': this.items[item].id,
                        'year': this.items[item].year,
                        'months': this.items[item].months,
                    });

                    sellingPlansTable = [...sellingPlansTable, ...this.tables[item]];
                };

                axios.post(route('administration.agencies.sellingPlans.saveData'),  {
                        'agency_id': this.$route.params.agency,
                        'sellingPlansTable': sellingPlansTable,
                        'domains': domains,
                    })
                    .then(({ data }) => {
                        this.$toastr.success('Зміни збережені');
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            procentFormat(a, b) {
                if (a === null) a = 0;
                if (b === null) b = 0;

                return (a === b || a > b) ? 100 : ((a * 100 / b).toFixed(2) * 1);
            },
            monthFormat(date, label = 'id') {
                const monthsOptions = this.monthsOptions();
                const month = new Date(date).getMonth();

                return monthsOptions[month][label];
            },
            yearOptions() {
                const currentYear = new Date().getYear() + 1901;

                return Array.from({ length: 30 }, (el, index) => {
                    return {
                        id: currentYear - index,
                        name: currentYear - index,
                    }
                });
            },
            monthsOptions() {
                return [
                    {
                        id: 1,
                        name: 'Січень'
                    },
                    {
                        id: 2,
                        name: 'Лютий'
                    },
                    {
                        id: 3,
                        name: 'Березень'
                    },
                    {
                        id: 4,
                        name: 'Квітень'
                    },
                    {
                        id: 5,
                        name: 'Травень'
                    },
                    {
                        id: 6,
                        name: 'Червень'
                    },
                    {
                        id: 7,
                        name: 'Липень'
                    },
                    {
                        id: 8,
                        name: 'Серпень'
                    },
                    {
                        id: 9,
                        name: 'Вересень'
                    },
                    {
                        id: 10,
                        name: 'Жовтень'
                    },
                    {
                        id: 11,
                        name: 'Листопад'
                    },
                    {
                        id: 12,
                        name: 'Грудень'
                    },
                ];
            },
        },
    };

</script>

<style lang="sass" scoped>
    .sales_plan
        padding-top: 0
        &__item
            padding-bottom: 1.8rem
            padding-top: 1.5rem
            padding-left: 1.7em
            padding-right: 1.7em
            margin-left: -.8em
            margin-right: -.8em
            &:nth-of-type(2n)
                box-shadow: inset 0 0 10px -2px hsla(0,0%,3%,.2)
                background-color: rgba(235,235,235,.1)
            .title
                &.is-5
                    font-size: 1.1rem
        &__buttons
            padding: .5em 0
            display: flex
            justify-content: flex-end
</style>
