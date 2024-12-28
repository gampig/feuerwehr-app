import { FeuerwehrGeraeteSettings } from "../models/AppSettings";
import { defineStore } from "pinia";
import { useDatabaseObject } from "vuefire";
import { shallowRef } from "vue";
import { firebaseApp } from "@/firebase";
import {
  child,
  DatabaseReference,
  ref as dbRef,
  getDatabase,
} from "firebase/database";

export const useAppSettingsStore = defineStore("appSettings", () => {
  const db = getDatabase(firebaseApp);
  const appSettingsRef = dbRef(db, "appSettings");

  const feuerwehrGeraeteRef = child(appSettingsRef, "feuerwehrGeraete");
  const feuerwehrGeraeteSource = shallowRef<DatabaseReference>();
  const feuerwehrGeraete = useDatabaseObject<FeuerwehrGeraeteSettings>(
    feuerwehrGeraeteSource
  );
  const loading = feuerwehrGeraete.pending;

  function bind() {
    feuerwehrGeraeteSource.value = feuerwehrGeraeteRef;
  }

  function unbind() {
    feuerwehrGeraeteSource.value = undefined;
  }

  return { feuerwehrGeraete, loading, bind, unbind };
});
