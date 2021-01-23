import { create, update, remove } from "@/utils/firebase/dbCRUD";
import { firebaseAction } from "vuexfire";
import serialize from "@/utils/firebase/serialize";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { ClothType } from "../models/ClothType";
import { ActionTree, MutationTree } from "vuex";

class State {
  loading = false;
  types: ClothType[] = [];
  type: ClothType | null = null;
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
    create: create("clothes/clothTypes"),
    update: update("clothes/clothTypes"),
    remove: remove("clothes/clothTypes"),

    bindTypes: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "types",
        firebase.database().ref("clothes/clothTypes"),
        { serialize }
      )
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbindTypes: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("types");
    }),

    bindType: firebaseAction(({ bindFirebaseRef, commit }, id: string) => {
      return bindFirebaseRef(
        "type",
        firebase.database().ref("clothes/clothTypes").child(id),
        { serialize }
      ).catch((error) => handleError(commit, error));
    }),
    unbindType: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("type");
    }),

    unbind({ dispatch }) {
      dispatch("unbindTypes");
      dispatch("unbindType");
    },
  },
};
