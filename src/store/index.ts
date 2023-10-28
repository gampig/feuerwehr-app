import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";

import auth from "./modules/auth";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
  },

  mutations: vuexfireMutations,

  strict: process.env.NODE_ENV !== "production",
});

store.dispatch("auth/init");

export default store;
