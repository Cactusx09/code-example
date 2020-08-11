export default {
    methods: {
        errorHandler(error, { refForm, setErrorsFlag } = {}) {
            if (Object.prototype.hasOwnProperty.call(this, 'loading')) {
                this.loading = false;
            }

            if (error.message) {
                console.error(error.message);
            }

            const { status, data } = error.response;

            if ([401, 419].includes(status) && this.$store.state.auth.isAuth) {
                this.$store.commit('setLastRoute', this.$route);
                this.$store.commit('appState', false);
                this.$store.commit('auth/logout');
                this.$router.push({ name: 'login' });
                return;
            }

            if ([403, 409, 429, 555].includes(status)) {
                this.$toastr.error(data.message);
                return;
            }

            if (status === 404) {
                this.$router.push({ name: 'notFound' });
                return;
            }

            if (status === 503) {
                window.location.reload();
            }

            if (status === 422) {
                const intoView = (element) => {
                    this.$nextTick(() => {
                        const dangerEl = element.querySelector('.help.is-danger');
                        if (dangerEl) dangerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    });
                };

                if (setErrorsFlag) {
                    this.errors.set(data.errors);
                    intoView(this.$el);
                }

                if (refForm) {
                    refForm.errors.set(data.errors);
                    intoView(refForm.$el);
                } else {
                    Object.keys(data.errors).forEach((key) => {
                        data.errors[key].forEach(message => this.$toastr.error(message));
                    });
                }

                return;
            }

            if (status === 500) {
                this.$toastr.error(`file: ${data.file}`);
                this.$toastr.error(`message: ${data.message}`);
                return;
            }

            const message = Object.keys(this.$options.methods).includes('i18n')
                ? this.i18n('Something went wrong...')
                : 'Something went wrong...';

            this.$toastr.error(message);

            throw error;
        },
    },
};
