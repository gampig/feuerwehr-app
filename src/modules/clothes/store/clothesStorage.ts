import { ActionTree, MutationTree } from "vuex";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { firebaseAction } from "vuexfire";
import { ClothingItem } from "../models/ClothingItem";

function serializeClothingItem(
  snapshot: firebase.database.DataSnapshot
): ClothingItem {
  const value = snapshot.val();
  const item: ClothingItem = {
    id: snapshot.key || "",
    amount: { value },
  };

  return item;
}

class State {
  loading = false;
  clothingItem: ClothingItem | null = null;
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
    bind: firebaseAction(({ bindFirebaseRef, commit }, clothType: string) => {
      commit("setLoading", true);
      return bindFirebaseRef(
        "clothingItem",
        firebase.database().ref("clothes/storage").child(clothType),
        { serialize: serializeClothingItem }
      )
        .catch((error) => handleError(commit, error))
        .finally(() => {
          commit("setLoading", false);
        });
    }),
    unbind: firebaseAction(({ unbindFirebaseRef }) => {
      unbindFirebaseRef("clothingItem");
    }),

    setAmountOfSize(
      { state, commit },
      { size, amount }: { size: string; amount?: number }
    ) {
      if (!state.clothingItem) {
        handleError(
          commit,
          Error("Interner Fehler: Kein Kleidungsstück ausgewählt")
        );
        return Promise.reject();
      }

      const firebaseAmount: number | null = amount || null;

      return firebase
        .database()
        .ref("clothes/storage")
        .child(state.clothingItem.id)
        .child(size)
        .set(firebaseAmount);
    },
  },
};
