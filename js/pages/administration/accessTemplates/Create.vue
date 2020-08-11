<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-fullhd is-full-until-fullhd">
            <access-template
                class="box has-background-light raises-on-hover"
                :path="route('administration.accessTemplates.create')"
                :errors="errors"
                @submit="save($event)">
                <template #submit-label>{{ i18n('Zberehty') }}</template>
            </access-template>
        </div>
    </div>
</template>

<script>

    import AccessTemplate from '@pages/administration/accessTemplates/AccessTemplate'

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        name: 'Create',

        components: { AccessTemplate },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                errors: new Errors(),
            };
        },

        methods: {
            save(data) {
                axios.post(route('administration.accessTemplates.store'), data)
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
