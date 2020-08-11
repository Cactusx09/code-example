<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-fullhd is-full-until-fullhd">
            <calculation-commission
                class="box has-background-light raises-on-hover"
                :path="route('administration.calculationCommissions.create')"
                :errors="errors"
                @submit="save($event)">
                <template #submit-label>{{ i18n('Zberehty') }}</template>
            </calculation-commission>
        </div>
    </div>
</template>

<script>

    import CalculationCommission from '@pages/administration/calculationCommissions/CalculationCommission'

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        name: 'Create',

        components: {
            CalculationCommission,
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                errors: new Errors(),
            };
        },

        methods: {
            save(data) {
                axios.post(route('administration.calculationCommissions.store'), data)
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));

                        this.$router.push({
                            name: data.redirect,
                            params: data.param,
                        });
                    })
                    .catch((error) => {
                        this.errorHandler(error, { setErrorsFlag: true });
                    });
            },
        },
    };
</script>
