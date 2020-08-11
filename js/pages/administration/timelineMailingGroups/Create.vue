<template>

    <timeline-mailing-groups
        ref="timelineMailingGroups"
        @save="save($event)"
    />

</template>

<script>

    import TimelineMailingGroups from '@pages/administration/timelineMailingGroups/TimelineMailingGroups'

    import errorHandler from '@components/mixins/errorHandler'

    export default {
        components: {
            TimelineMailingGroups,
        },

        mixins: [errorHandler],

        methods: {
            save(data) {
                axios.post('/api/administration/timelineMailingGroups', data)
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
