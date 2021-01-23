import { Notification } from "@/models/Notification";
import store from "@/store";

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

  store.commit("notifications/pushNotification", notification);
}
