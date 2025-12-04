// src/store/learning.js
const learning = {
  namespaced: true,

  state: {
    roadmap: null,
    purposes: []
  },

  getters: {
    getRoadmap(state) {
      return state.roadmap;
    },
    getPurposes(state) {
      return state.purposes;
    }
  },

  mutations: {
    setRoadmap(state, payload) {
      state.roadmap = payload;
    },
    setPurposes(state, purposes) {
      state.purposes = purposes;
    }
  },

  actions: {
    saveRoadmap({ commit }, roadmap) {
      commit("setRoadmap", roadmap);
    },
    savePurposes({ commit }, purposes) {
      commit("setPurposes", purposes);
    }
  }
};

export default learning;
