/* eslint-disable no-console */

import { register } from "register-service-worker";
import router from "./router";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log("App is being served from cache by a service worker.");
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      if (router.currentRoute.meta?.skipWaiting) {
        console.log("New content is available; app will refresh...");

        const worker = registration.waiting;
        if (worker !== null) {
          worker.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      } else {
        console.log("New content is available; please refresh.");
      }
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
