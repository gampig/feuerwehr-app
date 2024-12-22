<template>
  <v-app id="feuerwehr-app">
    <Loading v-if="loading" visible :text="loadingScreenText" />
    <router-view v-else />
  </v-app>
</template>

<script lang="ts" setup>
import version from "@/utils/version";
import modules from "./modules";
import Loading from "@/components/Loading.vue";
import { requiresAuth } from "./utils/routerAuth";
import { useAuthStore } from "./stores/auth";
import { useDatabaseSchemaStore } from "./stores/databaseSchema";
import { computed, ref, watch, watchEffect } from "vue";
import router from "./router";
import handleError from "./utils/store/handleError";

const authStore = useAuthStore();
const databaseSchemaStore = useDatabaseSchemaStore();

const loadingAuth = computed(() => authStore.loading);
const loggedIn = computed(() => authStore.loggedIn);
const loadingDatabaseSchemaVersion = computed(
  () => databaseSchemaStore.loading
);

const serviceWorkerRegistration = ref<ServiceWorkerRegistration | null>(null);
const updateFound = ref(false);
const updateDownloaded = ref(false);
const updateIsRequired = computed(() => databaseSchemaStore.updateIsRequired);

const loading = computed(
  () =>
    loadingAuth.value ||
    loadingDatabaseSchemaVersion.value ||
    updateIsRequired.value
);
const loadingScreenText = computed(() => {
  if (loadingAuth.value) {
    return "Anmelden...";
  } else if (loadingDatabaseSchemaVersion.value) {
    return "Lade Daten...";
  } else if (updateIsRequired.value) {
    if (updateFound.value) {
      return "Lade Update herunter...";
    } else if (updateDownloaded.value) {
      return "Update wurde heruntergeladen. Bitte App neu laden.";
    } else {
      return "Warte auf erforderliches Update...";
    }
  } else {
    return "Laden...";
  }
});

function checkAuthState() {
  if (
    loggedIn.value === true &&
    !loadingDatabaseSchemaVersion.value &&
    !updateIsRequired.value
  ) {
    onLogin();
  } else if (loggedIn.value === false) {
    onLogout();
  }
}

function onLogin() {
  modules.onLogin();

  const lastOnline = new Date().toISOString();
  authStore.updateClientMetadata({
    lastOnline,
    version,
  });
}

function onLogout() {
  modules.onLogout();
  toLoginPage();
}

function toLoginPage() {
  if (requiresAuth(route)) {
    router.replace({
      name: "UserLogin",
      params: { nextRouteName: "Home" },
    });
  }
}

function fetchDatabaseSchemaVersion() {
  databaseSchemaStore.bind();
}

function checkDatabaseSchemaVersion() {
  if (updateIsRequired.value) {
    if (updateDownloaded.value) {
      if (serviceWorkerRegistration.value?.waiting) {
        alert(
          "App wird neugestartet, damit ein erforderliches Update durchgeführt wird."
        );
        serviceWorkerRegistration.value.waiting.postMessage({
          type: "SKIP_WAITING",
        });
      } else {
        alert(
          "Bitte lade die App neu.\n\nEin erforderliches Update wurde heruntergeladen und muss installiert werden."
        );
      }
    }
  }
}

document.addEventListener(
  "swUpdateFound",
  () => {
    updateFound.value = true;
  },
  { once: true }
);

document.addEventListener(
  "swUpdated",
  (event) => {
    if (event instanceof CustomEvent) {
      updateDownloaded.value = true;
      serviceWorkerRegistration.value = event.detail;
    } else {
      handleError(new Error("Event ist nicht vom Typ CustomEvent"));
    }
  },
  { once: true }
);

watch(
  [loggedIn, loadingDatabaseSchemaVersion, updateIsRequired],
  checkAuthState
);
watchEffect(checkDatabaseSchemaVersion);

fetchDatabaseSchemaVersion();
checkAuthState();
</script>
