// src/store/modules/learning.js
export default {
  namespaced: true, // ✅ 모듈 네임스페이스 분리
  state: () => ({
    progress: 0, // 0, 50, 100
  }),
  mutations: {
    SET_PROGRESS(state, value) {
      state.progress = value;
    },
  },
  actions: {
    updateProgress({ commit }, value) {
      commit("SET_PROGRESS", value);
    },
  },
  getters: {
    getProgress: (state) => state.progress,
  },
};
