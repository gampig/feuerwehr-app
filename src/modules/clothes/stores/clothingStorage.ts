import { defineStore } from "pinia";
import { useDatabaseObject } from "vuefire";
import { computed, ref } from "vue";
import {
  child,
  ref as dbRef,
  set as dbSet,
  getDatabase,
} from "firebase/database";
import { firebaseApp } from "@/firebase";
import handleError from "@/utils/store/handleError";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { ClothingStorage } from "../models/ClothingStorage";

export const useClothingStorageStore = defineStore("clothingStorage", () => {
  const selectedClothingTypeId = ref<string>();

  const db = getDatabase(firebaseApp);

  const clothingItemsSource = computed(() =>
    selectedClothingTypeId.value === undefined ||
    !useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
      ? undefined
      : child(dbRef(db, "clothes/storage"), selectedClothingTypeId.value)
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

  return { clothingItems, loading, selectClothingType, set };
});
