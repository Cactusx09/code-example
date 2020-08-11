export default {
    methods: {
        setDropdownPosition(containerEl, selectEl) {
            if (!selectEl) return;

            const dropdownEl = selectEl.querySelector('.dropdown.is-active .dropdown-menu');

            const dropdownBottomPosition = dropdownEl.getBoundingClientRect().bottom - containerEl.getBoundingClientRect().top;
            if (dropdownBottomPosition + 5 > containerEl.clientHeight) {
                dropdownEl.style.top = 'auto';
                dropdownEl.style.bottom = 'calc(100% + 5px)';
            }
        },
        addEventListenersInContainer(containerEl) {
            containerEl.querySelectorAll('.vue-select').forEach((selectEl) => {
                selectEl.addEventListener('click', () => this.setDropdownPosition(containerEl, selectEl));
            });
        },
    },
};
