import { create, update, remove } from "@/utils/firebase/dbCRUD";
import { firebaseAction } from "vuexfire";
import serialize from "@/utils/firebase/serialize";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { Order } from "../models/Order";
import { ActionTree, MutationTree } from "vuex";

class State {
  loading = false;
  orders: Order[] = [];
  order: Order | null = null;
}

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    create: create("clothes/orders"),
    update: update("clothes/orders"),
    remove: remove("clothes/orders"),

    bindOrders: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "orders",
        firebase.database().ref("clothes/orders").orderByChild("submittedOn"),
        { serialize }
      )
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbindOrders: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("orders");
    }),

    bindOrder: firebaseAction(({ bindFirebaseRef, commit }, id: string) => {
      return bindFirebaseRef(
        "order",
        firebase.database().ref("clothes/orders").child(id),
        { serialize }
      ).catch((error) => handleError(commit, error));
    }),
    unbindOrder: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("order");
    }),

    unbind({ dispatch }) {
      dispatch("unbindOrders");
      dispatch("unbindOrder");
    },
  },
};
