<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-fullhd is-full-until-fullhd">
            <calculation-commission
                class="box has-background-light raises-on-hover"
                :path="route('administration.calculationCommissions.edit', calculationCommission)"
                :errors="errors"
                @submit="update($event)">
                <template #buttons>
                    <button
                        class="button is-danger"
                        @click="configDestroy = true">
                        <span class="is-hidden-mobile">{{ i18n('Delete') }}</span>
                        <span class="icon"><fa icon="trash-alt"/></span>
                    </button>
                </template>
            </calculation-commission>

            <confirm-modal
                :visible.sync="configDestroy"
                title="Vydalyty zapys?"
                @submit="destroy()"
            />
        </div>
    </div>
</template>

<script>

    import CalculationCommission from '@pages/administration/calculationCommissions/CalculationCommission'
    import ConfirmModal from '@components/ConfirmModal'

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        name: 'Create',

        components: {
            CalculationCommission,
            ConfirmModal,
        },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                errors: new Errors(),
                calculationCommission: this.$route.params.calculationCommission,
                configDestroy: false,
            };
        },

        methods: {
            update(data) {
                axios.patch(route('administration.calculationCommissions.update', this.calculationCommission), data)
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));
                    })
                    .catch((error) => {
                        this.errorHandler(error, { setErrorsFlag: true });
                    });
            },
            destroy() {
                axios.delete(route('administration.calculationCommissions.destroy', this.calculationCommission))
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));

                        this.$router.push({ name: 'administration.calculationCommissions.index' });
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            }
        },
    };
</script>
