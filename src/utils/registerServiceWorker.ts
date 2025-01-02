import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref } from "vue";

// Period in milliseconds
const period = 60 * 60 * 1000;

const swActivated = ref(false);

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}

export const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    if (period <= 0) return;
    if (r?.active?.state === "activated") {
      swActivated.value = true;
      registerPeriodicSync(swUrl, r);
    } else if (r?.installing) {
      r.installing.addEventListener("statechange", (e) => {
        const sw = e.target as ServiceWorker;
        swActivated.value = sw.state === "activated";
        if (swActivated.value) registerPeriodicSync(swUrl, r);
      });
    }
  },
  onRegisterError(e) {
    console.error(e);
  },
});
