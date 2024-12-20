import { defineStore } from "pinia";
import firebase from "firebase/app";

interface State {
  loading: Boolean;
  localSchemaVersion?: Number | null;
  remoteSchemaVersion?: Number | null;
}

export const useDatabaseSchemaStore = defineStore("databaseSchema", {
  state: (): State => ({
    loading: true,
    localSchemaVersion: import.meta.env.VITE_SUPPORTED_DATABASE_SCHEMA_VERSION,
    remoteSchemaVersion: undefined,
  }),

  getters: {
    updateIsRequired: (state) =>
      state.localSchemaVersion !== undefined &&
      state.localSchemaVersion !== null &&
      state.remoteSchemaVersion !== undefined &&
      state.remoteSchemaVersion !== null &&
      state.localSchemaVersion < state.remoteSchemaVersion,
  },

  actions: {
    bind() {
      firebase
        .database()
        .ref("schemaVersion")
        .once("value")
        .then((snapshot) => {
          const version = snapshot.val();
          if (typeof version === "number") {
            this.remoteSchemaVersion = version;
          }
        })
        .finally(() => (this.loading = false));
    },
  },
});
