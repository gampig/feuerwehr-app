import { Acl } from "@/acl";
import { feuerwehrGeraeteRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { useDatabaseObject } from "@/utils/store/vuefire";
import { defineStore } from "pinia";
import { computed } from "vue";
import { FeuerwehrGeraeteSettings } from "../models/AppSettings";

export const useAppSettingsStore = defineStore("appSettings", () => {
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
