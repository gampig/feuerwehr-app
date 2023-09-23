import { ActionTree, MutationTree } from "vuex";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { firebaseAction } from "vuexfire";
import { ClothingItem } from "../models/ClothingItem";

function serializeClothingItems(
  snapshot: firebase.database.DataSnapshot
): ClothingItem {
  const item = { size: snapshot.key || "", count: snapshot.val() };
  Object.defineProperty(item, ".key", { value: snapshot.key });
  return item;
}

class State {
  loading = false;
  clothingItemId: string | null = null;
  clothingItems: ClothingItem[] = [];
}

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setClothingItemId(state, clothingItemId: string | null) {
      state.clothingItemId = clothingItemId;
    },
  },

  actions: <ActionTree<State, any>>{
    bind: firebaseAction(
      ({ bindFirebaseRef, commit }, clothingType: string) => {
        commit("setLoading", true);
        return bindFirebaseRef(
          "clothingItems",
          firebase.database().ref("clothes/storage").child(clothingType),
          { serialize: serializeClothingItems }
        )
          .catch((error) => handleError(error))
          .finally(() => {
            commit("setClothingItemId", clothingType);
            commit("setLoading", false);
          });
      }
    ),
    unbind: firebaseAction(({ unbindFirebaseRef, commit }) => {
      unbindFirebaseRef("clothingItem");
      commit("setClothingItemId", null);
    }),

    set: ({ state }, clothingItem: ClothingItem) => {
      if (!state.clothingItemId) {
        handleError(Error("Interner Fehler: Kein Kleidungsstück ausgewählt"));
        return Promise.reject();
      }

      const firebaseCount: number | null = Number(clothingItem.count) || null;

      return firebase
        .database()
        .ref("clothes/storage")
        .child(state.clothingItemId)
        .child(clothingItem.size)
        .set(firebaseCount)
        .catch((error) => handleError(error));
    },
  },
};
