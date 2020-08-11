<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-fullhd is-full-until-fullhd">
            <access-template
                class="box has-background-light raises-on-hover"
                :path="route('administration.accessTemplates.edit', accessTemplate)"
                :errors="errors"
                @submit="update($event)"
            />
        </div>
    </div>
</template>

<script>

    import AccessTemplate from '@pages/administration/accessTemplates/AccessTemplate'

    import Errors from '@enso-ui/forms/errors'
    import errorHandler from '@components/mixins/errorHandler'

    export default {
        name: 'Edit',

        components: { AccessTemplate },

        inject: ['i18n'],

        mixins: [errorHandler],

        data() {
            return {
                errors: new Errors(),
                accessTemplate: this.$route.params.accessTemplate,
            };
        },

        methods: {
            update(data) {
                axios.patch(route('administration.accessTemplates.update', this.accessTemplate), data)
                    .then(({ data }) => {
                        this.$toastr.success(this.i18n(data.message));
                    })
                    .catch((error) => {
                        this.errorHandler(error, { setErrorsFlag: true });
                    });
            },
        },
    };
</script>
