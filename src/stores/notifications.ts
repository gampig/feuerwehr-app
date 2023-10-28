import { defineStore } from "pinia";
import { Notification } from "../models/Notification";

interface State extends Notification {
  id: number;
  show: boolean;
}

export const useNotificationsStore = defineStore("notifications", {
  state: (): State => ({
    id: 0,
    show: false,
    color: "error",
    text: "An error occurred",
    subText: "",
    timeout: 6000,
  }),

  actions: {
    setShow(show: boolean) {
      this.show = show;
    },
    pushNotification(notification: Notification) {
      this.id = Math.random();
      this.show = true;
      this.color = notification.color || "";
      this.text = notification.text;
      this.subText = notification.subText || "";
      this.timeout = notification.timeout || 6000;
    },
  },
});
