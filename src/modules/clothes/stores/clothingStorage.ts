import { defineStore } from "pinia";
import { useDatabaseList } from "vuefire";
import { ClothingItem } from "../models/ClothingItem";
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

export const useClothingStorageStore = defineStore("clothingStorage", () => {
  const selectedClothingTypeId = ref<string>();

  const db = getDatabase(firebaseApp);

  const clothingItemsSource = computed(() =>
    selectedClothingTypeId.value === undefined ||
    !useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
      ? undefined
      : child(dbRef(db, "clothes/storage"), selectedClothingTypeId.value)
  );
  const clothingItems = useDatabaseList<ClothingItem>(clothingItemsSource);
  const loading = clothingItems.pending;

  function selectClothingType(clothingTypeId?: string) {
    selectedClothingTypeId.value = clothingTypeId;
  }

  async function set(clothingItem: ClothingItem) {
    if (!clothingItemsSource.value) {
      return Promise.reject("Interner Fehler: Kein Kleidungsstück ausgewählt");
    }

    try {
      return await dbSet(
        child(clothingItemsSource.value, clothingItem.size),
        clothingItem.count > 0 ? clothingItem.count : null
      );
    } catch (error) {
      return handleError(error);
    }
  }

  return { clothingItems, loading, selectClothingType, set };
});
