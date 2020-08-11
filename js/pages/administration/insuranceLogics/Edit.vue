<template>
    <div class="box insurance-logics has-padding-large animated">

        <insurance-logics v-if="init"
            ref="insuranceLogics"
            :data-original="data"
            @save-insurance-logics="saveInsuranceLogics()"
            :errors="errors"/>
    </div>
</template>

<script>
import InsuranceLogics from '@pages/administration/insuranceLogics/InsuranceLogics'

import Errors from '@enso-ui/forms/src/classes/Errors'
import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        InsuranceLogics,
    },

    mixins: [errorHandler],

    data() {
        return {
            data: {},
            init: false,
            errors: new Errors(),
        }
    },

    created() {
        this.getInsuranceLogics();
    },

    methods: {
        getInsuranceLogics() {
            axios.get(route('administration.insuranceLogics.getData'), {
                    params: {
                        insurance_logic_id: this.$route.params.insuranceLogic,
                    }
                })
                .then(({ data }) => {
                    this.data = data;
                    this.init = true;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });;
        },
        saveInsuranceLogics() {
            axios.post(`/api/administration/insuranceLogics/saveData?insurance_logic_id=${this.$route.params.insuranceLogic}`, this.data)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    //if (this.$route.query.insurance_reference) return;

                    let evaluateData = [];
                    data.knownUsedVariableNames.forEach((name) => {
                        if (name === '#result') return;
                        let row = this.$refs.insuranceLogics.evaluate.table.find((item) => item.name === name.substring(1));

                        evaluateData.push({
                            name: name.substring(1),
                            user_value: row ? row.user_value : 0,
                            result_calculat: row ? row.result_calculat : null,
                        });
                    });

                    this.$refs.insuranceLogics.evaluate.table = evaluateData;
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
    }
}
</script>
