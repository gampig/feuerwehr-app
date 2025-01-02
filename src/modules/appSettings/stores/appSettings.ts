import { FeuerwehrGeraeteSettings } from "../models/AppSettings";
import { defineStore } from "pinia";
import { computed } from "vue";
import { firebaseApp } from "@/firebase";
import { child, ref as dbRef, getDatabase } from "firebase/database";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { useDatabaseObject } from "@/utils/store/vuefire";

export const useAppSettingsStore = defineStore("appSettings", () => {
  const db = getDatabase(firebaseApp);
  const appSettingsRef = dbRef(db, "appSettings");

  const feuerwehrGeraeteRef = child(appSettingsRef, "feuerwehrGeraete");
  const feuerwehrGeraeteSource = computed(() =>
    useAuthStore().hasAnyRole(Acl.feuerwehrGeraete)
      ? feuerwehrGeraeteRef
      : undefined
  );
  const feuerwehrGeraete = useDatabaseObject<FeuerwehrGeraeteSettings>(
    feuerwehrGeraeteSource
  );
  const loading = feuerwehrGeraete.pending;

  return {
    feuerwehrGeraete,
    loading,

    // Private variables
    feuerwehrGeraeteSource,
  };
});
