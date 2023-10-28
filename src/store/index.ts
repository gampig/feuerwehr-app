import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: vuexfireMutations,

  strict: process.env.NODE_ENV !== "production",
});

export default store;
