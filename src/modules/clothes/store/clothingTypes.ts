import CrudFactory from "@/utils/firebase/CrudFactory";
import { firebaseAction } from "vuexfire";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { ClothingType } from "../models/ClothingType";
import { ActionTree, MutationTree } from "vuex";

class State {
  loading = false;
  loadingType = false;
  types: ClothingType[] = [];
  type: ClothingType | null = null;
}

const crudFactory = new CrudFactory<State, ClothingType>(
  "clothes/clothingTypes"
);

function preprocessType(type: ClothingType): ClothingType {
  type.isAvailable = Boolean(type.isAvailable);
  type.price = Number(type.price) || undefined;
  return type;
}

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setLoadingType(state, loading: boolean) {
      state.loadingType = loading;
    },
  },

  actions: <ActionTree<State, any>>{
    create: crudFactory.makeCreate(preprocessType),
    update: crudFactory.makeUpdate(preprocessType),
    set: crudFactory.makeSet(preprocessType),
    remove: crudFactory.makeRemove(),

    bindTypes: firebaseAction(({ bindFirebaseRef, commit }) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "types",
        firebase
          .database()
          .ref("clothes/clothingTypes")
          .orderByChild("category")
      )
        .catch((error) => handleError(error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbindTypes: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("types");
    }),

    bindType: firebaseAction(({ bindFirebaseRef, commit }, id: string) => {
      commit("setLoadingType", true);
      return bindFirebaseRef(
        "type",
        firebase.database().ref("clothes/clothingTypes").child(id)
      )
        .catch((error) => handleError(error))
        .finally(() => {
          commit("setLoadingType", false);
        });
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
