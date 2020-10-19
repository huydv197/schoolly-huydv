import * as actionTypes from "~/utils/action-types";
import * as mutationTypes from "~/utils/mutation-types";
import { RESPONSE_SUCCESS } from "~/utils/config";
import * as APIs from "~/utils/endpoints";

const state = () => ({
  studentOlClass: {},
})

const actions = {
  async [actionTypes.OLCLASS_JOINED_STUDENTS.LIST]({ commit }, payload) {
    try {
      const { data } = await this.$axios.get(`${APIs.TEACHING_OLCLASS_JOINED_STUDENTS}`, {
        params: payload
      });
      console.log("[TEACHING_OLCLASS_JOINED_STUDENTS.LIST]", data);
      if (data.success == RESPONSE_SUCCESS) {
        commit(mutationTypes.OLCLASS_JOINED_STUDENTS.SET_OLCLASS_JOINED_STUDENT_LIST, data);
      }
      return data;
    } catch (error) {
      console.log("[TEACHING_OLCLASS_JOINED_STUDENTS.LIST] error", error);
    }
  },

};

/**
 * initial mutations
 */
const mutations = {
  [mutationTypes.OLCLASS_JOINED_STUDENTS.SET_OLCLASS_JOINED_STUDENT_LIST](state, _data) {
    state.studentOlClass = _data;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};