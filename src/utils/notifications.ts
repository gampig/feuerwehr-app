import { Notification } from "@/models/Notification";
import { useNotificationsStore } from "@/stores/notifications";

export function showError(error: string) {
  showMessage(error, "error");
}

export function showMessage(message: string, color = "success") {
  const notification: Notification = {
    color,
    /*
    text: typeof message === "string" ? message : message.message,
    subText: message.response ? message.response.data.message : "",
    */
    text: message,
  };

  const store = useNotificationsStore();
  store.pushNotification(notification);
}
