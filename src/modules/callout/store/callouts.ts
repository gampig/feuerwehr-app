import { create } from "@/utils/firebase/dbCRUD";
import { firebaseAction } from "vuexfire";
import serialize from "@/utils/firebase/serialize";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { Callout } from "../models/Callout";
import { ActionTree, GetterTree, MutationTree } from "vuex";

class State {
  loading = false;
  callouts: Callout[] = [];
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
    create: create<Callout>("callouts"),

    bind: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);

      return bindFirebaseRef(
        "callouts",
        firebase.database().ref("callouts").orderByChild("alarmTime"),
        { serialize }
      )
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("callouts");
    }),
  },
};
