import { createStore, Store } from "vuex";
import { vuexfireMutations } from "vuexfire";

declare module "vue" {
  interface ComponentCustomProperties {
    $store: Store<any>;
  }
}

const store = createStore({
  mutations: vuexfireMutations,

  strict: import.meta.env.NODE_ENV !== "production",
});

export default store;
