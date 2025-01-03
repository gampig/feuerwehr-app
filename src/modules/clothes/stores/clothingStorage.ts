import { Acl } from "@/acl";
import { clothesStorageRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import handleError from "@/utils/store/handleError";
import { useDatabaseObject } from "@/utils/store/vuefire";
import { child, set as dbSet } from "firebase/database";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ClothingStorage } from "../models/ClothingStorage";

export const useClothingStorageStore = defineStore("clothingStorage", () => {
  const selectedClothingTypeId = ref<string>();

  const clothingItemsSource = computed(() =>
    selectedClothingTypeId.value === undefined ||
    !useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
      ? undefined
      : child(clothesStorageRef, selectedClothingTypeId.value)
  );
  const clothingItems = useDatabaseObject<ClothingStorage>(clothingItemsSource);
  const loading = clothingItems.pending;

  function selectClothingType(clothingTypeId: string) {
    selectedClothingTypeId.value = clothingTypeId;
  }

  async function set(size: string, count: number | null) {
    if (!clothingItemsSource.value) {
      return Promise.reject("Interner Fehler: Kein Kleidungsstück ausgewählt");
    }

    try {
      return await dbSet(child(clothingItemsSource.value, size), count);
    } catch (error) {
      return handleError(error);
    }
  }

  return {
    clothingItems,
    loading,

    // Private variables
    selectedClothingTypeId,
    clothingItemsSource,

    selectClothingType,
    set,
  };
});
