import { Acl } from "@/acl";
import { clothesTypesRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import handleError from "@/utils/store/handleError";
import { useDatabaseList, useDatabaseObject } from "@/utils/store/vuefire";
import {
  child,
  push as dbPush,
  remove as dbRemove,
  set as dbSet,
  update as dbUpdate,
  orderByChild,
  query,
} from "firebase/database";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ClothingType } from "../models/ClothingType";

export const useClothingTypesStore = defineStore("clothingTypes", () => {
  const isAuthorized = computed(() =>
    useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
  );

  const typesQuery = query(clothesTypesRef, orderByChild("category"));
  const typesSource = computed(() =>
    isAuthorized.value ? typesQuery : undefined
  );
  const types = useDatabaseList<ClothingType>(typesSource);
  const loading = types.pending;

  const selectedTypeId = ref<string>();
  const selectedTypeSource = computed(() =>
    isAuthorized.value && selectedTypeId.value !== undefined
      ? child(clothesTypesRef, selectedTypeId.value)
      : undefined
  );
  const selectedType = useDatabaseObject<ClothingType>(selectedTypeSource);
  const selectedTypeLoading = selectedType.pending;

  function selectType(clothingTypeId: string) {
    selectedTypeId.value = clothingTypeId;
  }

  function create(clothingType: ClothingType) {
    return dbPush(clothesTypesRef, deleteUndefinedProperties(clothingType));
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
    return dbRemove(child(clothesTypesRef, clothingTypeId)).catch(handleError);
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
