import firebase from "firebase/compat/app";
import handleError from "@/utils/store/handleError";
import { FeuerwehrGeraeteSettings } from "../models/AppSettings";
import { defineStore } from "pinia";

interface State {
  loading: boolean;
  feuerwehrGeraete?: FeuerwehrGeraeteSettings;
}

export const useAppSettingsStore = defineStore("appSettings", {
  state: (): State => ({
    loading: false,
  }),

  actions: {
    bindFeuerwehrGeraeteSettings() {
      this.setLoading(true);
      return firebase
        .database()
        .ref("appSettings")
        .child("feuerwehrGeraete")
        .get()
        .then((snapshot) => {
          this.setFeuerwehrGeraeteSettings(snapshot.val());
        })
        .catch((error) => handleError(error))
        .finally(() => {
          this.setLoading(false);
        });
    },
    unbind() {
      this.setFeuerwehrGeraeteSettings(undefined);
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setFeuerwehrGeraeteSettings(
      feuerwehrGeraeteSettings?: FeuerwehrGeraeteSettings
    ) {
      this.feuerwehrGeraete = feuerwehrGeraeteSettings;
    },
  },
});
