<template>
    <div class="timeline__wrp">
        <div class="timeline__head has-background-light animated fadeIn">
            <form-message
                :show="showFormMessage"
                :policyMessages="policyMessages"
                ref="formMessage"
                @new-message="messages = [$event, ...messages]"
                @reset="
                    showFormMessage = false;
                    getPolicy();
                "
                @policy="getPolicy($event)"
            />

            <control-timeline
                v-if="!showFormMessage"
                :show-form-message.sync="showFormMessage"
                :contract-id="contractId"
                @update="
                    updateParams({
                        page: 1,
                        ...$event,
                    });
                    fetchMessages(true);
                "
            />
        </div>

        <time-line
            :messages="messages"
            :status="status"
            :selected="policySelected"
            class="timeline__body"
            @update="fetchMessages()"
            @condition="messages.find((item) => item.id === $event.id).condition = $event.condition"
            @selected="selectedMessage($event)"
        />
    </div>
</template>

<script>

import ControlTimeline from '@pages/inwork/contracts/_tabs/Messages/Control'
import FormMessage from '@pages/inwork/contracts/_tabs/Messages/FormMessage'
import TimeLine from '@pages/inwork/contracts/_tabs/Messages/TimeLine'

import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        FormMessage,
        ControlTimeline,
        TimeLine,
    },

    mixins: [errorHandler],

    data() {
        return {
            contractId: Number(this.$route.params.contract),
            params: {
                perPage: 10,
                type: null,
                search: null,
                page: 1,
                bank_filter: null,
            },
            messages: [],
            status: 0,
            showFormMessage: false,
            policySelected: false,
            policyMessages: [],
        };
    },

    created() {
        this.fetchMessages();
    },

    methods: {
        updateMesages(data) {
            this.messages = _.uniqBy([...this.messages, ...data], 'id');
        },

        updateParams(params) {
            Object.keys(params).forEach((name) => {
                this.params[name] = params[name] || null;
            });
        },

        fetchMessages(remove = false) {
            this.status = 2;

            const params = {
                resource_id: this.contractId,
                resource_model: 'App\\Models\\InsuranceContract',
                ...this.params,
            };

            axios.get(route('timeline.getMessages'), { params })
                .then(({ data }) => {
                    if (remove) this.messages = [];

                    const { messages } = data;

                    this.updateMesages(messages.data);
                    this.getPagination(messages.current_page, messages.last_page);
                })
                .catch((error) => {
                    this.errorHandler(error);

                    this.status = 0;
                });
        },

        getPagination(current, prev) {
            if (current >= prev) {
                this.status = 0;

                return;
            }

            this.params.page += 1;
            this.status = 1;
        },

        getPolicy(policy) {
            this.policySelected = policy === 'selected';
        },

        selectedMessage(id) {
            const index = this.policyMessages.findIndex(policyId => policyId === id);

            if (index >= 0) {
                this.policyMessages.splice(index, 1);
            } else {
                this.policyMessages.push(id);
            }
        },
    },
};

</script>

<style lang="sass">
.timeline
    &__wrp
        margin: 2rem 0 5rem
    &__head
        box-shadow: 0 2px 18px 1px rgba(42, 51, 83, 0.35)
        border-radius: 6px
        position: relative
        z-index: 9
        & > div
            padding: 0 .75rem
        .columns
            flex-wrap: wrap
    &__body
        padding: 1rem
        margin: -1rem
</style>
