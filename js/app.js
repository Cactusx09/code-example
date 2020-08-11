import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faHome,
    faAdjust,
    faAtlas,
    faCalculator,
    faCar,
    faCarSide,
    faFileContract,
    faCreditCard,
    faExchangeAlt,
    faGlobe,
    faGlobeAmericas,
    faHotel,
    faPiggyBank,
    faPrint,
    faShoppingBasket,
    faShoppingCart,
    faListOl,
} from '@fortawesome/free-solid-svg-icons';

library.add([
    faHome,
    faAdjust,
    faAtlas,
    faCalculator,
    faCar,
    faCarSide,
    faFileContract,
    faCreditCard,
    faExchangeAlt,
    faGlobe,
    faGlobeAmericas,
    faHotel,
    faPiggyBank,
    faPrint,
    faShoppingBasket,
    faShoppingCart,
    faListOl,
]);

import Vue from 'vue';
import _ from 'lodash';

Vue.mixin({
    computed: {
        "_": function () {
            return _;
        },
    },
});
