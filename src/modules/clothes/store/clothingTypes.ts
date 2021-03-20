import { create, update, remove } from "@/utils/firebase/dbCRUD";
import { firebaseAction } from "vuexfire";
import serialize from "@/utils/firebase/serialize";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { ClothingType } from "../models/ClothingType";
import { ActionTree, MutationTree } from "vuex";

class State {
  loading = false;
  types: ClothingType[] = [];
  type: ClothingType | null = null;
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
    create: create("clothes/clothingTypes"),
    update: update("clothes/clothingTypes"),
    remove: remove("clothes/clothingTypes"),

    bindTypes: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "types",
        firebase.database().ref("clothes/clothingTypes"),
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
        firebase.database().ref("clothes/clothingTypes").child(id),
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
