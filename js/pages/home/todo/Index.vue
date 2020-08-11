<template>

    <div class="container-fluid is-fullheight">

        <div class="columns">
            <div class="column is-3-fullhd is-4-widescreen is-4-desktop is-5-tablet is-12-mobile">
                <enso-date-filter class="box"
                    title="Дата"
                    :interval="intervals.todos.end_at">
                </enso-date-filter>
            </div>
            <div class="column is-3-fullhd is-4-widescreen is-4-desktop is-5-tablet is-12-mobile">
                <enso-select-filter class="box"
                    title="Статус"
                    multiple
                    :options="statusOptions"
                    v-model="filters.todos.status_id">
                </enso-select-filter>
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <enso-table
                        class="box"
                        :path="path"
                        :intervals="intervals"
                        :filters="filters"
                        id="todos">
                </enso-table>
            </div>
        </div>

    </div>

</template>

<script>

    import store from '@store';
    import moment from 'moment';

    import { EnsoTable } from '@enso-ui/tables/bulma';
    import { EnsoSelectFilter, EnsoDateFilter } from '@enso-ui/filters/bulma';

    import { library } from '@fortawesome/fontawesome-svg-core';
    import { faListUl }
        from '@fortawesome/free-solid-svg-icons';

    library.add(faListUl);

    export default {
        store,

        components: { EnsoTable, EnsoSelectFilter, EnsoDateFilter, },

        data() {
            return {
                path: route('home.todos.initTable'),
                amountOfDays: 10,
                statusOptions: [
                    { id: 1, name: 'Створено' },
                    { id: 2, name: 'Прострочено' },
                ],
                intervals: {
                    todos: {
                        end_at: {
                            min: '',
                            max: '',
                            dbDateFormat: 'Y-m-d H:i:s',
                        },
                    },
                },
                filters: {
                    todos: {
                        status_id: [],
                    }
                },
            };
        },
    };

</script>
