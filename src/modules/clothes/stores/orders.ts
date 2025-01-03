import { defineStore } from "pinia";
import { OrderEntity } from "../models/Order";
import { computed, ref } from "vue";
import { firebaseApp } from "@/firebase";
import {
  getDatabase,
  ref as dbRef,
  push as dbPush,
  update as dbUpdate,
  set as dbSet,
  remove as dbRemove,
  child,
} from "firebase/database";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import { useDatabaseList, useDatabaseObject } from "@/utils/store/vuefire";

export const useOrdersStore = defineStore("orders", () => {
  const db = getDatabase(firebaseApp);
  const ordersRef = dbRef(db, "clothes/orders");
  const isAuthorized = computed(() =>
    useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
  );

  const ordersSource = computed(() =>
    isAuthorized.value ? ordersRef : undefined
  );
  const orders = useDatabaseList<OrderEntity>(ordersSource);
  const loading = orders.pending;

  const selectedOrderId = ref<string>();
  const selectedOrderSource = computed(() =>
    isAuthorized.value && selectedOrderId.value
      ? child(ordersRef, selectedOrderId.value)
      : undefined
  );
  const selectedOrder = useDatabaseObject<OrderEntity>(selectedOrderSource);
  const selectedOrderLoading = selectedOrder.pending;

  function selectOrder(orderId: string) {
    selectedOrderId.value = orderId;
  }

  function create(order: OrderEntity) {
    return dbPush(ordersRef, deleteUndefinedProperties(order));
  }

  function update(order: OrderEntity) {
    if (!selectedOrderSource.value) {
      return Promise.reject("Keine Bestellung ausgewählt");
    }
    return dbUpdate(
      selectedOrderSource.value,
      deleteUndefinedProperties(order)
    );
  }

  function set(order: OrderEntity) {
    if (!selectedOrderSource.value) {
      return Promise.reject("Keine Bestellung ausgewählt");
    }
    return dbSet(selectedOrderSource.value, deleteUndefinedProperties(order));
  }

  function remove(orderId: string) {
    return dbRemove(child(ordersRef, orderId));
  }

  return {
    orders,
    loading,
    selectedOrder,
    selectedOrderLoading,

    // Private variables
    isAuthorized,
    ordersSource,
    selectedOrderId,
    selectedOrderSource,

    selectOrder,
    create,
    update,
    set,
    remove,
  };
});
