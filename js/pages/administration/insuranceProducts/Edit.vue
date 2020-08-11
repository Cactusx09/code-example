<template>
    <div
        v-if="Object.keys(productData).length > 0"
        class="product box has-padding-large">
        <insurance-product
            :product-data="productData"
            :errors="errors"
            @save="saveProduct($event)"
            ref="product">
            <template #buttons>
                <div class="product__btns level-right">
                    <button
                        class="button is-info has-margin-right-medium"
                        @click="
                            $router.push({
                                name: 'administration.insuranceProducts.create',
                                params: {
                                    insuranceProductId: insuranceProductId,
                                },
                            });
                        ">
                        {{ i18n('Kopiyuvaty') }}
                    </button>

                    <button
                        class="button is-success"
                        @click="$refs.product.getDataObject()">
                        {{ i18n('Zberehty') }}
                    </button>
                </div>
            </template>
        </insurance-product>
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

    inject: ['i18n'],

    mixins: [errorHandler],

    props: {
        insuranceProduct: {
            type: [String, Number],
            default: null,
        },
        id: {
            type: Number,
            default: null,
        },
    },

    data() {
        return {
            errors: new Errors(),
            insuranceProductId: this.id || this.insuranceProduct,
            productData: {},
        };
    },

    created() {
        this.getProduct();
    },

    methods: {
        getProduct() {
            axios.get(route('insuranceProduct.getData'), {
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
        saveProduct(productData) {
            axios.post(route('insuranceProduct.saveData'), productData)
                .then(({ data }) => {
                    this.$toastr.success(data.message);
                })
                .catch((error) => {
                    this.errorHandler(error, { setErrorsFlag: true });
                });
        },
    },
};

</script>
