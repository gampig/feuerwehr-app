<template>
  <v-app id="feuerwehr-app">
    <Loading :visible="loading" :text="loadingScreenText" />
    <router-view v-if="!initializing" />
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
import handleError from "./utils/store/handleError";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const databaseSchemaStore = useDatabaseSchemaStore();

const loggedIn = computed(() => authStore.loggedIn);
const loadingDatabaseSchema = computed(() => databaseSchemaStore.loading);
const updateIsRequired = computed(() => databaseSchemaStore.updateIsRequired);

const serviceWorkerRegistration = ref<ServiceWorkerRegistration | null>(null);
const updateFound = ref(false);
const updateDownloaded = ref(false);

const initializing = ref(true);
const loading = computed(
  () =>
    initializing.value ||
    loggedIn.value === undefined ||
    loadingDatabaseSchema.value ||
    updateIsRequired.value
);
const loadingScreenText = computed(() => {
  if (loggedIn.value === undefined) {
    return "Anmelden...";
  } else if (loadingDatabaseSchema.value) {
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
    !loadingDatabaseSchema.value &&
    !updateIsRequired.value
  ) {
    initializing.value = false;
    onLogin();
  } else if (loggedIn.value === false) {
    initializing.value = false;
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
      query: { next: route.fullPath },
    });
  }
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

watch([loggedIn, loadingDatabaseSchema, updateIsRequired], checkAuthState);
watchEffect(checkDatabaseSchemaVersion);

checkAuthState();
</script>
