<template>
    <div
        v-if="initSigns"
        class="user box has-padding-large animated fadeIn">
        <div class="user__block">
            <u-table
                :template="signsTemplate"
                :table.sync="data.signTableData"
                :scroll="5"
            />
        </div>

        <div class="user__btns level-right">
            <button class="button is-success"
                @click="save()">
                {{ i18n('Zberehty') }}
            </button>
        </div>
    </div>
</template>

<script>
import UTable from '@components/UTable'
import SignsTemplate from '@pages/administration/users/templates/Signs'

import Errors from '@enso-ui/forms/errors'
import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        UTable,
    },

    inject: ['i18n'],

    mixins: [
        SignsTemplate,
        errorHandler,
    ],

    data() {
        return {
            initSigns: false,
            data: {
                user_id: null,
                signTableData: [],
            },
            errors: new Errors(),
        };
    },

    created() {
        this.getSigns();
    },

    methods: {
        getSigns() {
            axios.get(route('administration.users.signs.getData'), {
                    params: {
                        user_id: this.$route.params.user
                    }
                })
                .then(({ data }) => {
                    this.data = data;
                    this.initSigns = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        save() {
            axios.post(route('administration.users.signs.saveData'), this.data)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
};

</script>

<style lang="sass">
    .user
        &__block
            padding-bottom: 2.5rem
            padding-top: 2rem
            margin-left: -24px
            padding-left: 24px
            margin-right: -24px
            padding-right: 24px
            transition: .5s
            &:nth-of-type(2n)
                box-shadow: inset 0 0 10px -2px hsla(0,0%,3%,.2)
                background-color: rgba(235, 235, 235, .1)
            &:first-of-type
                padding-top: .5em

            .title
                &.is-5
                    font-size: 1.2rem
            .text-bounded
                background-color: #f5f5f5
                padding: 1em 16px
                border-radius: 6px
                font-size: .9rem
                font-weight: 300
                margin-bottom: 20px
                margin-top: 20px
                transition: 5s
                display: flex
                align-items: center
                span
                    line-height: 1.4
                i
                    color: #209cee
                    margin-right: .75em

</style>

