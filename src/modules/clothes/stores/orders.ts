import { Acl } from "@/acl";
import { clothesOrdersRef } from "@/firebase";
import { useAuthStore } from "@/stores/auth";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";
import { useDatabaseList, useDatabaseObject } from "@/utils/store/vuefire";
import {
  child,
  push as dbPush,
  remove as dbRemove,
  set as dbSet,
  update as dbUpdate,
} from "firebase/database";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { OrderEntity } from "../models/Order";

export const useOrdersStore = defineStore("orders", () => {
  const isAuthorized = computed(() =>
    useAuthStore().hasAnyRole(Acl.kleiderverwaltung)
  );

  const ordersSource = computed(() =>
    isAuthorized.value ? clothesOrdersRef : undefined
  );
  const orders = useDatabaseList<OrderEntity>(ordersSource);
  const loading = orders.pending;

  const selectedOrderId = ref<string>();
  const selectedOrderSource = computed(() =>
    isAuthorized.value && selectedOrderId.value
      ? child(clothesOrdersRef, selectedOrderId.value)
      : undefined
  );
  const selectedOrder = useDatabaseObject<OrderEntity>(selectedOrderSource);
  const selectedOrderLoading = selectedOrder.pending;

  function selectOrder(orderId: string) {
    selectedOrderId.value = orderId;
  }

  function create(order: OrderEntity) {
    return dbPush(clothesOrdersRef, deleteUndefinedProperties(order));
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
    return dbRemove(child(clothesOrdersRef, orderId));
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
