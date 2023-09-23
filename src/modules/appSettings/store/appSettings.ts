import { GetterTree, MutationTree, ActionTree } from "vuex";
import firebase from "firebase/app";
import handleError from "@/utils/store/handleError";
import { FeuerwehrGeraeteSettings } from "../models/AppSettings";

class State {
  loading = true;
  feuerwehrGeraete?: FeuerwehrGeraeteSettings;
}

const appSettingsModule = {
  namespaced: true,

  state: new State(),

  getters: <GetterTree<State, any>>{},

  actions: <ActionTree<State, any>>{
    bindFeuerwehrGeraeteSettings({ commit }) {
      commit("setLoading", true);
      return firebase
        .database()
        .ref("appSettings")
        .child("feuerwehrGeraete")
        .get()
        .then((snapshot) => {
          commit("setFeuerwehrGeraeteSettings", snapshot.val());
        })
        .catch((error) => handleError(error))
        .finally(() => {
          commit("setLoading", false);
        });
    },
    unbind({ commit }) {
      commit("setFeuerwehrGeraeteSettings", undefined);
    },
  },

  mutations: <MutationTree<State>>{
    setLoading(state, loading: boolean) {
      state.loading = loading;
    },
    setFeuerwehrGeraeteSettings(
      state,
      feuerwehrGeraeteSettings?: FeuerwehrGeraeteSettings
    ) {
      state.feuerwehrGeraete = feuerwehrGeraeteSettings;
    },
  },
};

export default appSettingsModule;
