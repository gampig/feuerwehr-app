import { Acl } from "@/acl";
import { clothesStorageRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import handleError from "@/utils/store/handleError";
import { useDatabaseObject } from "@/utils/store/vuefire";
import { child, set as dbSet } from "firebase/database";
import { defineStore } from "pinia";
import { computed } from "vue";
import { ClothingStorage } from "../models/ClothingStorage";

export const useClothingStorageStore = defineStore("clothingStorage", () => {
  const clothingItemsSource = computed(() =>
    !useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
      ? undefined
      : clothesStorageRef
  );
  const clothingStorage =
    useDatabaseObject<ClothingStorage>(clothingItemsSource);
  const loading = clothingStorage.pending;

  async function set(
    clothingTypeId: string,
    size: string,
    count: number | null
  ) {
    try {
      const clothingItemsRef = child(clothesStorageRef, clothingTypeId);
      return await dbSet(child(clothingItemsRef, size), count);
    } catch (error) {
      return handleError(error);
    }
  }

  return {
    clothingStorage,
    loading,

    // Private variables
    clothingItemsSource,

    set,
  };
});
