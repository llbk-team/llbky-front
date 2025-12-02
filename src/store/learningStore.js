// src/store/learning.js
const learning = {
  namespaced: true,

  state: {
    roadmap: null
  },

  getters: {
    getRoadmap(state) {
      return state.roadmap;
    }
  },

  mutations: {
    setRoadmap(state, payload) {
      state.roadmap = payload;
    }
  },

  actions: {
    saveRoadmap({ commit }, roadmap) {
      commit("setRoadmap", roadmap);
    }
  }
};

export default learning;
