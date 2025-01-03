import { remoteSchemaVersionRef } from "@/firebase";
import { useDatabaseObject } from "@/utils/store/vuefire";
import { defineStore } from "pinia";
import { computed } from "vue";

interface PrimitiveType<T> {
  $value: T;
}

export const useDatabaseSchemaStore = defineStore("databaseSchema", () => {
  const localSchemaVersion = import.meta.env
    .VITE_SUPPORTED_DATABASE_SCHEMA_VERSION;
  const remoteSchemaVersionObject = useDatabaseObject<PrimitiveType<number>>(
    remoteSchemaVersionRef
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

  return {
    loading,
    updateIsRequired,
  };
});
