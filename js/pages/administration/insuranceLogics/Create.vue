<template>
    <div class="box insurance-logics has-padding-large animated">

        <insurance-logics ref="insuranceLogics"
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
            data: {
                id: null,
                code: '',
                name: '',
                description: '',
                formula: '',
                insuranceLogicVariablesTable: [],
            },
            errors: new Errors(),
        }
    },

    methods: {
        saveInsuranceLogics() {
            axios.post(route('administration.insuranceLogics.saveData'), this.data)
                .then(({ data }) => {
                    this.$toastr.success(data.message);

                    this.$router.push({
                        name: 'administration.insuranceLogics.edit',
                        params: {
                            insuranceLogic: data.id,
                        },
                    });
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
    }
}
</script>
