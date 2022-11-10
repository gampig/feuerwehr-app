import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";

import notifications from "./modules/notifications";
import auth from "./modules/auth";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    notifications,
    auth,
  },

  mutations: vuexfireMutations,

  strict: process.env.NODE_ENV !== "production",
});

store.dispatch("auth/init");

export default store;
