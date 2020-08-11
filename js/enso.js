import Vue from 'vue';

import '@core-modules';

import App from '@enso-ui/ui/bulma';
import router from './router';
import store from './store';

import '@components/directives/preventClicks';

import './app';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    ...App,
}).$mount('#app');
