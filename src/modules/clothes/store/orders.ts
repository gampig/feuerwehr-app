import CrudFactory from "@/utils/firebase/CrudFactory";
import { firebaseAction } from "vuexfire";
import firebase from "firebase/compat/app";
import handleError from "@/utils/store/handleError";
import { Order } from "../models/Order";
import { ActionTree, MutationTree } from "vuex";

class State {
  loading = false;
  loadingOrder = false;
  orders: Order[] = [];
  order: Order | null = null;
}

const crudFactory = new CrudFactory<State, Order>("clothes/orders");

function preprocessOrder(order: Order): Order {
  function toOptNum(field: any) {
    return Number(field) || undefined;
  }
  order.count = toOptNum(order.count);
  order.paid = toOptNum(order.paid);
  order.submittedOn = Number(order.submittedOn);
  order.orderedOn = toOptNum(order.orderedOn);
  order.doneOn = toOptNum(order.doneOn);
  return order;
}

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setLoadingOrder(state, loading: boolean) {
      state.loadingOrder = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    create: crudFactory.makeCreate(preprocessOrder),
    update: crudFactory.makeUpdate(preprocessOrder),
    set: crudFactory.makeSet(preprocessOrder),
    remove: crudFactory.makeRemove(),

    bindOrders: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "orders",
        firebase.database().ref("clothes/orders").orderByChild("submittedOn")
      )
        .catch((error) => handleError(error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbindOrders: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("orders");
    }),

    bindOrder: firebaseAction(({ bindFirebaseRef, commit }, id: string) => {
      commit("setLoadingOrder", true);
      return bindFirebaseRef(
        "order",
        firebase.database().ref("clothes/orders").child(id)
      )
        .catch((error) => handleError(error))
        .finally(() => {
          commit("setLoadingOrder", false);
        });
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
