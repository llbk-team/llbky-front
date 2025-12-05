const user = {
  namespaced: true,

  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,
  },

  getters: {
    isLoggedIn: state => !!state.user,
    userInfo: state => state.user,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    }
  },

  actions: {
    // 로그인 실행
    login({ commit }, user) {
      commit("SET_USER", user);
      localStorage.setItem("user", JSON.stringify(user));
    },

    // 로그아웃 실행
    logout({ commit }) {
      commit("CLEAR_USER");
      localStorage.removeItem("user");
    },

    // 새로고침 시 자동 로그인 복구
    restoreLogin({ commit }) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        commit("SET_USER", JSON.parse(savedUser));
      }
    }
  }
};

export default user;