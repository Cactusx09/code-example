// import _ from 'lodash';
import Vue from 'vue';
import ErrorHandler from '@components/mixins/errorHandler'

export const state = {
    route: null,
    data: {},
    structure: {},
    groups: {},
    styles: {
        done: {
            class: 'is-success',
            messageIcon: 'check',
            groupIcon: 'check',
        },
        inProcess: {
            class: 'is-danger',
            messageIcon: 'times',
            groupIcon: 'times',
        },
        isWarning: {
            class: 'is-warning',
            messageIcon: 'exclamation-triangle',
            groupIcon: 'exclamation',
        },
    },
};
// const setPreferences = payload => axios.patch(route('core.preferences.setPreferences'), payload);

// const updateLocal = payload => setPreferences({ route: payload.route, value: payload.value });

export const getters = {
    route: state => state.route,
    data: state => state.data,
    structure: state => state.structure,
    section: state => section => state.data[section],
    group: state => ({ section, group }) => state.data[section][group],
    // inProcess: state => ({ section, group }) => state.data[section][group].some(item => item.style === 'inProcess'),
    // inProcess: state => wizardIndex => _.get(state.data, wizardIndex).some(item => item.style === 'inProcess'),
    inProcess: state => wizardIndexArr => {
        if (!wizardIndexArr) return;

        let isInProcess = false;
        wizardIndexArr.forEach((index) => {
            const group = _.get(state.data, index);
            if (group) {
                isInProcess = group.some(message => message.style === 'inProcess');
            }
        });
        return isInProcess;
    },
    groups: state => state.groups,
    groupStyle: state => groupKey => state.groups[groupKey],
};

export const mutations = {
    setRoute: (state, route) => { state.route = route; },
    // setRouteParams: (state, params) => { state.route.params = params; },
    setData: (state, data) => {
        state.data = data;
    },
    setStructure: (state, structure) => {
        state.structure = structure;
    },
    setSelectedSection: (state, { key, section }) => {
        state.data[key] = section;
    },
    buildSectionStyles: (state, { key, section }) => {
        let first = true;
        Object.entries(section).forEach(([groupKey, group]) => {
            let groupStyle = 'done';
            group.forEach((message) => {
                if (message.style === 'inProcess') groupStyle = 'inProcess';
                else if (first && message.style === 'isWarning') groupStyle = 'isWarning';
            });

            Vue.set(state.groups, groupKey, {
                style: groupStyle,
                hidden: !first,
                section: key,
                messages: group,
                invisible: state.structure[key].position ? !first : false,
            });

            if (groupStyle !== 'done') {
                first = false;
            }
        });
    },
    updateGroupStyle: (state, { group, style }) => {
        const groupStyle = state.groups[group];
        groupStyle.style = style;

        state.data[groupStyle.section][group].forEach((message) => {
            message.style = style;
        });
    },
    updateGroupPosition: (state, { group, position = {}, elSelector }) => {
        const elRelative = document.querySelector(elSelector);
        // const wizardEl = document.querySelector(`.${state.groups[group].wizard}`);

        let top = elRelative.offsetTop;
        if (position.align === 'center') {
            top += elRelative.offsetHeight / 2;
        }

        Vue.set(state.groups[group], 'position', `
            top: ${top}px;
            position: absolute;
            transform: translateY(${position.offset}px);
        `);
    },
    updateGroupHidden: (state, { group, hidden }) => {
        state.groups[group].hidden = hidden;
    },
    updateGroupVisibility: (state, { group, invisible }) => {
        state.groups[group].invisible = invisible;
    },
    updateMessageStyle: (state, { wizardIndex, style }) => {
        _.get(state.wizards, wizardIndex).style = style;
    },
};

export const actions = {
    set: ({ commit }, structure) => {
        commit('setStructure', structure);
        return new Promise((resolve) => {
            if (!state.route) resolve();

            axios.get(state.route.url, {
                params: state.route.params,
            }).then(({ data }) => {
                commit('setData', data);

                Object.entries(state.data).forEach(([key, section]) => {
                    commit('buildSectionStyles', { key, section });
                });

                resolve();
            }).catch((error) => {
                ErrorHandler.methods.errorHandler(error);
            });
        });
    },
    setSelectedSections: ({ commit }, { whiteList, blackList, params }) => {
        axios.get(state.route.url, {
            params: {
                whitelist: whiteList,
                blacklist: blackList,
                ...state.route.params,
                ...params
            },
        }).then(({ data }) => {
            Object.entries(data).forEach(([key, section]) => {
                commit('setSelectedSection', { key, section });
                commit('buildSectionStyles', { key, section });
            });
        }).catch((error) => {
            ErrorHandler.methods.errorHandler(error);
        });
    },
    updateStepGroupStyle: ({ commit }, { groupName, nextGroupName }) => {
        commit('updateGroupStyle', { group: groupName, style: 'done' });

        commit('updateGroupHidden', { group: nextGroupName, hidden: false });
        commit('updateGroupVisibility', { group: nextGroupName, invisible: false });
    },
    updateGroupsStyle: ({ commit }, groups) => {
        Object.entries(groups).forEach(([name, groupStyle]) => {
            if (groupStyle === 'style') {
                commit('updateGroupHidden', { group: name, hidden: false });
            } else {
                commit('updateGroupStyle', { group: name, style: groupStyle });
            }
        });
    },
    resetGroupsStyle: ({ commit }, groupsArr) => {
        groupsArr.forEach((groupName, index) => {
            commit('updateGroupStyle', { group: groupName, style: 'inProcess' });
            commit('updateGroupHidden', { group: groupName, hidden: index > 0 });
        });
    },
};
