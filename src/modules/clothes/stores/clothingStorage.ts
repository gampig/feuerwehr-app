import { defineStore } from "pinia";
import { useDatabaseList } from "vuefire";
import { ClothingItem } from "../models/ClothingItem";
import { shallowRef } from "vue";
import {
  child,
  DatabaseReference,
  ref as dbRef,
  set as dbSet,
  getDatabase,
} from "firebase/database";
import { firebaseApp } from "@/firebase";
import handleError from "@/utils/store/handleError";

export const useClothingStorageStore = defineStore("clothingStorage", () => {
  const db = getDatabase(firebaseApp);

  const clothingItemsSource = shallowRef<DatabaseReference>();
  const clothingItems = useDatabaseList<ClothingItem>(clothingItemsSource);
  const loading = clothingItems.pending;

  function bind(clothingTypeId: string) {
    const clothingItemsRef = child(
      dbRef(db, "clothes/storage"),
      clothingTypeId
    );
    clothingItemsSource.value = clothingItemsRef;
  }

  function unbind() {
    clothingItemsSource.value = undefined;
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

  return { clothingItems, loading, bind, unbind, set };
});
