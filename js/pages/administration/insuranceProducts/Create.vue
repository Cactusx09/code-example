<template>
    <div
        v-if="Object.keys(productData).length > 0"
        class="product box has-padding-large">
        <insurance-product
            :product-data="productData"
            :errors="errors"
            @save="saveProduct($event)"
        />
    </div>
</template>

<script>
import InsuranceProduct from './InsuranceProduct'

import Errors from '@enso-ui/forms/errors'
import errorHandler from '@components/mixins/errorHandler'

export default {
    components: {
        InsuranceProduct,
    },

    mixins: [errorHandler],

    props: {
        insuranceProductId: {
            type: [Number, String],
            default: null,
        },
        calculationId: {
            type: [Number, String],
            default: null,
        },
    },

    data() {
        return {
            productData: {},
            errors: new Errors(),
        };
    },

    created() {
        if (this.insuranceProductId) {
            this.getCopyProduct();
        } else if (this.calculationId || this.$route.query.calculationId) {
            this.getCalculationQuoteData();
        } else if (this.$route.query.consultationId) {
            this.getConsultationQuoteData();
        } else {
            this.getDefaultBankAccount();
        }
    },

    methods: {
        getDefaultBankAccount() {
            axios.get(route('system.bankAccounts.getDefaultBankAccount'))
                .then(({ data }) => {
                    this.productData = { productBankAccountTable: data };
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getCopyProduct() {
            axios.get(route('insuranceProduct.getCopyData'), {
                    params: {
                        insurance_product_id: this.insuranceProductId,
                    },
                })
                .then(({ data }) => {
                    this.productData = data.fields;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getCalculationQuoteData() {
            axios.get(route('insuranceProduct.getCalculationQuoteData'), {
                    params: {
                        calculation_id: this.calculationId || this.$route.query.calculationId,
                    },
                })
                .then(({ data }) => {
                    this.productData = data.fields;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        getConsultationQuoteData() {
            axios.get(route('insuranceProduct.getConsultationRequestQuoteData'), {
                    params: {
                        insurance_product_id: this.$route.query.insuranceProductId,
                        consultation_id: this.$route.query.consultationId,
                    },
                })
                .then(({ data }) => {
                    this.productData = data.fields;
                })
                .catch((error) => {
                    this.errorHandler(error);
                });
        },
        saveProduct(productData) {
            axios.post(route('insuranceProduct.saveData'), productData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                    this.$router.push({
                        name: 'administration.insuranceProducts.edit',
                        params: {
                            insuranceProduct: String(data.id),
                        },
                    });
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
    },
};

</script>
