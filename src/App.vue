<template>
  <v-app id="feuerwehr-app">
    <Snackbar></Snackbar>
    <PWABadge></PWABadge>
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
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Snackbar from "./components/bars/Snackbar.vue";
import { useNetworkStore } from "./stores/network";
import PWABadge from "./components/PWABadge.vue";
import {
  needRefresh as updateDownloaded,
  updateServiceWorker,
} from "./utils/registerServiceWorker";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const databaseSchemaStore = useDatabaseSchemaStore();
useNetworkStore();

const { loggedIn } = storeToRefs(authStore);
const { loading: loadingDatabaseSchema, updateIsRequired } =
  storeToRefs(databaseSchemaStore);

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
    if (updateDownloaded.value) {
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
      alert(
        "Ein erforderliches Update wurde heruntergeladen und muss installiert werden.\n\nDie Seite wird neu geladen."
      );
      updateServiceWorker();
    }
  }
}

watch([loggedIn, loadingDatabaseSchema, updateIsRequired], checkAuthState);
watchEffect(checkDatabaseSchemaVersion);

checkAuthState();
</script>
