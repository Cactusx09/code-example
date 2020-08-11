<template>
    <div>
        <div class="timeline__sections">
            <div
                v-for="(message, date) in filterMessage"
                :key="`message-${date}`"
                class="timeline__section">
                <h1 class="timeline__day title is-6 has-text-grey-light">
                    {{ date }}
                </h1>

                <card
                    v-for="card in message"
                    :key="`${date}-${card.id}`"
                    :message="card"
                    :selected="selected"
                    @condition="postMarkAsRead(card.id)"
                    @selected="$emit('selected', card.id)"
                />
            </div>
        </div>

        <spiner
            :status="status"
            @update="$emit('update')"
        />
    </div>
</template>

<script>
import Card from '@pages/inwork/contracts/_tabs/Messages/Card';
import Spiner from '@pages/inwork/contracts/_tabs/Messages/Spiner';

import SmoothReflow from 'vue-smooth-reflow';
import moment from 'moment';

import errorHandler from '@components/mixins/errorHandler';

export default {
    components: {
        Card,
        Spiner,
    },

    mixins: [
        SmoothReflow,
        errorHandler,
    ],

    props: {
        messages: {
            type: Array,
            default() {
                return [];
            },
        },
        status: {
            type: Number,
            default: 0,
        },
        selected: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        filterMessage() {
            return this.messages.reduce((reduce, item) => {
                const { created_at: createdAt, ...message } = item;
                const date = moment(createdAt, ['DD-MM-YYYY']).format('DD.MM.YYYY');

                const cardMessage = {
                    time: moment(createdAt, ['DD-MM-YYYY HH:mm']).format('HH:mm'),
                    ...message,
                };

                reduce[date] = [...reduce[date] || [], cardMessage];

                return reduce;
            }, {});
        },
    },

    mounted() {
        this.$smoothReflow();
    },

    methods: {
        postMarkAsRead(id) {
            axios
                .post(route('timeline.markAsRead'), {
                    message_id: id,
                })
                .then(({ data }) => {
                    if (data.status === 'success') {
                        this.$emit('condition', {
                            id: data.message_id,
                            condition: data.message_condition,
                        });
                    }
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    },
};
</script>

<style lang="sass">
.timeline
    &__day
        text-align: center
    &__sections
        margin-top: 25px
    &__section
        margin-bottom: 1.5rem
.modal-gallery
    .modal-content
        width: calc(100% - 200px)
        height: 100%
        overflow: hidden
        display: flex
        justify-content: center
        align-items: center
.iframeCustom
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
</style>
