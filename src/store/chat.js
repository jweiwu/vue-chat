export default {
  namespaced: true,
  state: {
    users: [],
    message: [],
  },
  getters: {
    users(state) {
      return state.users;
    },
    message(state) {
      return state.message;
    },
  },
  actions: {
    updateUsers(context, users) {
      context.commit('updateUsers', users);
    },
    addMessage(context, message) {
      context.commit('addMessage', message);
    },
    clearMessage(context) {
      context.commit('clearMessage');
    },
  },
  mutations: {
    updateUsers(state, users) {
      state.users = users;
    },
    addMessage(state, message) {
      state.message = [...state.message, message];
    },
    clearMessage(state) {
      state.message = [];
    },
  },
};
