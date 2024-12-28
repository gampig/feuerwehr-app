import { defineStore } from "pinia";
import { firebaseApp } from "@/firebase";
import { getDatabase, ref as dbRef } from "firebase/database";
import { useDatabaseObject } from "vuefire";
import { computed, watch } from "vue";

interface PrimitiveType<T> {
  $value: T;
}

export const useDatabaseSchemaStore = defineStore("databaseSchema", () => {
  const db = getDatabase(firebaseApp);

  const localSchemaVersion = import.meta.env
    .VITE_SUPPORTED_DATABASE_SCHEMA_VERSION;
  const remoteSchemaVersionSource = dbRef(db, "schemaVersion");
  const remoteSchemaVersionObject = useDatabaseObject<PrimitiveType<number>>(
    remoteSchemaVersionSource
  );

  const loading = remoteSchemaVersionObject.pending;

  const remoteSchemaVersion = computed(
    () => remoteSchemaVersionObject.value?.$value
  );

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
