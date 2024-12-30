import { defineStore } from "pinia";
import { useDatabaseList, useDatabaseObject } from "vuefire";
import { ClothingType } from "../models/ClothingType";
import { computed, ref } from "vue";
import { firebaseApp } from "@/firebase";
import {
  getDatabase,
  ref as dbRef,
  push as dbPush,
  update as dbUpdate,
  set as dbSet,
  remove as dbRemove,
  orderByChild,
  query,
  child,
} from "firebase/database";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import handleError from "@/utils/store/handleError";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";

export const useClothingTypesStore = defineStore("clothingTypes", () => {
  const db = getDatabase(firebaseApp);
  const isAuthorized = computed(() =>
    useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
  );
  const typesRef = dbRef(db, "clothes/clothingTypes");

  const typesQuery = query(typesRef, orderByChild("category"));
  const typesSource = computed(() =>
    isAuthorized.value ? typesQuery : undefined
  );
  const types = useDatabaseList<ClothingType>(typesSource);
  const loading = types.pending;

  const selectedTypeId = ref<string>();
  const selectedTypeSource = computed(() =>
    isAuthorized.value && selectedTypeId.value !== undefined
      ? child(typesRef, selectedTypeId.value)
      : undefined
  );
  const selectedType = useDatabaseObject<ClothingType>(selectedTypeSource);
  const selectedTypeLoading = selectedType.pending;

  function selectType(clothingTypeId: string) {
    selectedTypeId.value = clothingTypeId;
  }

  function create(clothingType: ClothingType) {
    return dbPush(typesRef, deleteUndefinedProperties(clothingType));
  }

  function update(clothingType: ClothingType) {
    if (!selectedTypeSource.value) {
      return Promise.reject("Kein Kleidungstyp ausgewählt");
    }
    return dbUpdate(
      selectedTypeSource.value,
      deleteUndefinedProperties(clothingType)
    );
  }

  function set(clothingType: ClothingType) {
    if (!selectedTypeSource.value) {
      return Promise.reject("Kein Kleidungstyp ausgewählt");
    }
    return dbSet(
      selectedTypeSource.value,
      deleteUndefinedProperties(clothingType)
    );
  }

  function remove(clothingTypeId: string) {
    return dbRemove(child(typesRef, clothingTypeId)).catch(handleError);
  }

  return {
    types,
    selectedType,
    loading,
    selectedTypeLoading,

    // Private variables
    isAuthorized,
    typesSource,
    selectedTypeId,
    selectedTypeSource,

    selectType,
    create,
    update,
    set,
    remove,
  };
});
