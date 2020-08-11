<template>
    <div v-if="init"
        class="print_form box">
        <div class="columns">
            <div class="column is-2-fullhd is-2-widescreen is-2-desktop is-3-tablet is-12-mobile">
                <button class="button is-fullwidth is-info"
                    @click="$refs.pdfEditor.printDocument()">
                    {{ i18n('Nadrukuvaty') }}
                </button>
            </div>
        </div>
        <pdfEditor ref="pdfEditor"
            :editor-content.sync="data.printing_form_body"
            :variables="data.variables"
            hidden-variables
            class="print_form__body columns"/>
    </div>
</template>

<script>
import pdfEditor from '@components/pdfEditor'

import errorHandler from '@components/mixins/errorHandler'

export default {

    inject: ['i18n'],

    mixins: [errorHandler],

    components: { pdfEditor },

    data() {
        return {
            data: {
                printing_form_body: '',
                variables: {}
            },
            init: false,
        }
    },

    created() {
        this.getCompareCalculations();
    },

    methods: {
        getCompareCalculations() {
            const calculationIds = this.$route.query.calculation_ids;

            axios.get(route('inwork.consultations.compareCalculations'), {
                    params: {
                        insurance_consultation_id: this.$route.query.insurance_consultation_id,
                        calculation_ids: Array.isArray(calculationIds) ? calculationIds : [calculationIds],
                    },
                })
                .then(({ data }) => {
                    const { printing_form_body, ...variables } = data;

                    this.data = {
                        printing_form_body: printing_form_body,
                        variables: variables,
                    }

                    this.init = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
    }
}
</script>

<style lang="sass">

.print_form
    padding-bottom: 0
    &__body
        border-top: 1px solid #dbdbdb
        align-items: stretch
        margin: 0 -1.25rem -.75rem -1.25rem
        border-bottom-right-radius: 5px
        border-bottom-left-radius: 5px
        overflow: hidden
        height: 800px
</style>

