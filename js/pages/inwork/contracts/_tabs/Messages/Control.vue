<template>
    <div class="timeline__filter">
        <div class="columns is-variable is-2">
            <div class="column is-3-fullhd is-3-widescreen is-6-desktop is-6-tablet is-12-mobile">
                <div class="control has-icons-left has-icons-right">
                    <input
                        type="text"
                        class="input"
                        v-model="formData.search"
                        :placeholder="i18n('Poshuk po timeline')"
                        @input="changeInputSearch()"
                    >

                    <span class="icon is-small is-left">
                        <fa icon="search"/>
                    </span>
                </div>
            </div>

            <div class="column is-2-fullhd is-2-widescreen is-2-desktop is-6-tablet is-12-mobile">
                <vue-select
                    v-model="formData.type"
                    :track-by="'type'"
                    :options="optionsTypeFile"
                    :placeholder="i18n('Filtr')"
                    :i18n="i18n"
                    translated
                    @update="update()"
                />
            </div>

            <div class="column is-3-fullhd is-3-widescreen is-3-desktop is-6-tablet is-12-mobile">
                <vue-select
                    v-model="bankFilter"
                    :options="optionsContractBanks"
                    :placeholder="i18n('Filtr po bankam')"
                    ref="bankFilter"
                    :i18n="i18n"
                    translated
                    multiple
                    @update="update()"
                />
            </div>

            <div class="column is-1-fullhd is-1-widescreen is-1-desktop is-1-tablet is-2-mobile">
                <vue-select
                    v-model="formData.perPage"
                    :options="optionsPerPage"
                    disable-clear
                    @update="update()"
                />
            </div>

            <div class="column is-narrow">
                <button
                    class="button"
                    @click="
                        reset();
                        update();
                    ">
                    {{ i18n('Skynuty fil\'try') }}
                </button>
            </div>

            <div class="column is-narrow">
                <button
                    class="button is-success"
                    :disabled="showFormMessage"
                    @click="$emit('update:showFormMessage', true)">
                    {{ i18n('Ctvoryty povidomlennya') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import OptionsControl from './OptionsControl'

import { VueSelect } from '@enso-ui/select/bulma'

export default {
    components: { VueSelect },

    mixins: [OptionsControl],

    inject: ['i18n'],

    props: {
        showFormMessage: Boolean,
        contractId: {
            type: Number,
            require: true,
        },
    },

    data() {
        return {
            formData: {
                search: null,
                type: null,
                perPage: 10,
            },
            bankFilter: [],
            optionsContractBanks: [],
        };
    },

    created() {
        this.getContractBankOptions();
    },

    methods: {
        getContractBankOptions() {
            axios.get(route('timeline.getContractBankOptions'), {
                    params: {
                        contract_id: this.contractId,
                    }
                })
                .then(({ data }) => {
                    this.optionsContractBanks = data;
                });
        },

        update() {
            const bankFilter = this.$refs.bankFilter.selection.map(({ id, entity }) => ({ id, entity }));

            this.$emit('update', {
                bank_filter: this.bankFilter.length > 0
                    ? JSON.stringify(bankFilter)
                    : null,
                ...this.formData,
            });
        },

        changeInputSearch: _.debounce(function () {
            this.update();
        }, 1000),

        reset() {
            this.formData.search = null;
            this.formData.type = null;
            this.formData.perPage = 10;
        },
    },
};

</script>

<style lang="sass" scoped>
.timeline__filter
    padding-top: .75rem
</style>
