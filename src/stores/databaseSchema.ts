import { defineStore } from "pinia";
import { firebaseApp } from "@/firebase";
import { getDatabase, ref as dbRef } from "firebase/database";
import { useDatabaseObject } from "vuefire";
import { computed } from "vue";

export const useDatabaseSchemaStore = defineStore("databaseSchema", () => {
  const db = getDatabase(firebaseApp);

  const localSchemaVersion = import.meta.env
    .VITE_SUPPORTED_DATABASE_SCHEMA_VERSION;
  const remoteSchemaVersionSource = dbRef(db, "schemaVersion");
  const remoteSchemaVersion = useDatabaseObject<number>(
    remoteSchemaVersionSource
  );
  const loading = remoteSchemaVersion.pending;

  const updateIsRequired = computed(
    () =>
      localSchemaVersion !== undefined &&
      localSchemaVersion !== null &&
      remoteSchemaVersion.value !== undefined &&
      remoteSchemaVersion.value !== null &&
      localSchemaVersion < remoteSchemaVersion.value
  );

  return { loading, updateIsRequired };
});
