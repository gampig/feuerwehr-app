import { defineStore } from "pinia";
import { useDatabaseList, useDatabaseObject } from "vuefire";
import { Order } from "../models/Order";
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
  query,
  orderByChild,
} from "firebase/database";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";

export const useOrdersStore = defineStore("orders", () => {
  const db = getDatabase(firebaseApp);
  const ordersRef = dbRef(db, "clothes/orders");
  const isAuthorized = computed(() =>
    useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
  );

  const ordersQuery = query(ordersRef, orderByChild("submittedOn"));
  const ordersSource = computed(() =>
    isAuthorized.value ? ordersQuery : undefined
  );
  const orders = useDatabaseList<Order>(ordersSource);
  const loading = orders.pending;

  const selectedOrderId = ref<string>();
  const selectedOrderSource = computed(() =>
    isAuthorized.value && selectedOrderId.value
      ? child(ordersRef, selectedOrderId.value)
      : undefined
  );
  const selectedOrder = useDatabaseObject<Order>(selectedOrderSource);
  const selectedOrderLoading = selectedOrder.pending;

  function selectOrder(orderId: string) {
    selectedOrderId.value = orderId;
  }

  function create(order: Order) {
    return dbPush(ordersRef, deleteUndefinedProperties(order));
  }

  function update(order: Order) {
    if (!selectedOrderSource.value) {
      return Promise.reject("Keine Bestellung ausgewählt");
    }
    return dbUpdate(
      selectedOrderSource.value,
      deleteUndefinedProperties(order)
    );
  }

  function set(order: Order) {
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
