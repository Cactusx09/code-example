<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-desktop is-full-touch">
            <brands-groups @save="save($event)"/>
        </div>
    </div>
</template>

<script>

    import BrandsGroups from '@pages/administration/brandsGroups/BrandsGroups'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: { BrandsGroups },

        mixins: [errorHandler],

        methods: {
            save(data) {
                axios.post(route('administration.brandsGroups.store'), data)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);

                        this.$router.push({ name: data.redirect, params: data.param });
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
        },
    };

</script>
