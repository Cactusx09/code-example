import Vue from 'vue';

Vue.directive('preventClicks', {
    bind(el) {
        el.addEventListener('click', () => {
            el.disabled = true;
            setTimeout(() => {
                el.disabled = false;
            }, 700);
        });
    },
    unbind(el) {
        el.removeEventListener('click', () => {
            el.disabled = true;
            setTimeout(() => {
                el.disabled = false;
            }, 700);
        });
    },
});
