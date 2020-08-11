<template>
    <div class="columns is-centered">
        <div class="column is-three-quarters-desktop is-full-touch">
            <brands-groups
                :brands-group-id="brandsGroupId"
                @save="save($event)"/>
        </div>
    </div>
</template>

<script>

    import BrandsGroups from '@pages/administration/brandsGroups/BrandsGroups'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: { BrandsGroups },

        mixins: [errorHandler],

        data() {
            return {
                brandsGroupId: Number(this.$route.params.brandsGroup),
            };
        },

        methods: {
            save(data) {
                axios.patch(route('administration.brandsGroups.update', this.brandsGroupId), data)
                    .then(({ data }) => {
                        this.$toastr.success(data.message);
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },
        },
    };

</script>
