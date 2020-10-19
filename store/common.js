import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";

/**
 * initial state
 */
const state = () => ({
  breadcrumb: []
});

/**
 * initial getters
 */
const getters = {
  breadcrumb: state => {
    return state.breadcrumb
  }
};

const actions = {
  
};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.COMMON.SET_BREADCRUMB](state, data) {
    console.log('state.breadcrumb', data)
    state.breadcrumb = data
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
