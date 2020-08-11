<template>

    <timeline-mailing-groups
        :init="init"
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

        data() {
            return {
                timelineMailingGroupId: this.$route.params.timelineMailingGroup,
                init: false,
            };
        },

        created() {
            this.fetch();
        },

        methods: {
            fetch() {
                axios.get(`/api/administration/timelineMailingGroups/${this.timelineMailingGroupId}/edit`)
                    .then(({ data }) => {
                        this.$refs.timelineMailingGroups.updateData(data);
                        this.init = true;
                    })
                    .catch((error) => {
                        this.errorHandler(error);
                    });
            },

            save(data) {
                axios.patch(`/api/administration/timelineMailingGroups/${this.timelineMailingGroupId}`, data)
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
