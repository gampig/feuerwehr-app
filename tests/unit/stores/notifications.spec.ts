import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useNotificationsStore } from "@/stores/notifications";

describe("stores/notifications", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with empty notifications queue", () => {
    const store = useNotificationsStore();

    expect(store.notificationsQueue).toEqual([]);
    expect(store.notificationsQueueLength).toBe(0);
  });

  it("pushes notifications to the queue", () => {
    const store = useNotificationsStore();

    const notification = { text: "Test message", color: "success" };
    store.pushNotification(notification);

    expect(store.notificationsQueue).toEqual([notification]);
    expect(store.notificationsQueueLength).toBe(1);
  });

  it("pops notifications from the queue", () => {
    const store = useNotificationsStore();

    const notification1 = { text: "First message", color: "info" };
    const notification2 = { text: "Second message", color: "warning" };

    store.pushNotification(notification1);
    store.pushNotification(notification2);

    expect(store.notificationsQueueLength).toBe(2);

    const popped = store.popNotification();
    expect(popped).toEqual(notification1);
    expect(store.notificationsQueueLength).toBe(1);
    expect(store.notificationsQueue).toEqual([notification2]);
  });

  it("returns null when popping from empty queue", () => {
    const store = useNotificationsStore();

    const popped = store.popNotification();
    expect(popped).toBeNull();
    expect(store.notificationsQueueLength).toBe(0);
  });

  it("handles multiple push and pop operations", () => {
    const store = useNotificationsStore();

    const notifications = [
      { text: "Message 1", color: "success" },
      { text: "Message 2", color: "error" },
      { text: "Message 3", color: "info" },
    ];

    // Push all notifications
    notifications.forEach((notification) =>
      store.pushNotification(notification)
    );
    expect(store.notificationsQueueLength).toBe(3);

    // Pop them in FIFO order
    expect(store.popNotification()).toEqual(notifications[0]);
    expect(store.popNotification()).toEqual(notifications[1]);
    expect(store.popNotification()).toEqual(notifications[2]);
    expect(store.notificationsQueueLength).toBe(0);

    // Try to pop from empty queue
    expect(store.popNotification()).toBeNull();
  });
});
