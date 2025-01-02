import { defineStore } from "pinia";
import { Notification } from "../models/Notification";
import { computed, ref } from "vue";

export const useNotificationsStore = defineStore("notifications", () => {
  const notificationsQueue = ref<Notification[]>([]);
  const notificationsQueueLength = computed(
    () => notificationsQueue.value.length
  );

  function pushNotification(notification: Notification) {
    notificationsQueue.value.push(notification);
  }

  function popNotification(): Notification | null {
    const notifications = notificationsQueue.value.splice(0, 1);
    if (notifications.length === 0) {
      return null;
    } else {
      return notifications[0];
    }
  }

  return {
    notificationsQueue,
    notificationsQueueLength,
    pushNotification,
    popNotification,
  };
});
