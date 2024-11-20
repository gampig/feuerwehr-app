<template>
  <v-app id="feuerwehr-app">
    <router-view />
    <Loading :visible="loading" :text="loadingScreenText" />
  </v-app>
</template>

<script lang="ts" setup>
import version from "@/utils/version";
import modules from "./modules";
import Loading from "@/components/Loading.vue";
import { requires } from "./utils/routerAuth";
import { useAuthStore } from "./stores/auth";
import { useDatabaseSchemaStore } from "./stores/databaseSchema";
import { computed, watch } from "vue";
import router from "./router";

const authStore = useAuthStore();
const databaseSchemaStore = useDatabaseSchemaStore();

const loadingAuth = computed(() => authStore.loading);
const loggedIn = computed(() => authStore.loggedIn);
const loadingDatabaseSchemaVersion = computed(
  () => databaseSchemaStore.loading
);
const updateIsRequired = computed(() => databaseSchemaStore.updateIsRequired);

const loading = computed(
  () => loadingAuth.value || loadingDatabaseSchemaVersion.value
);
const loadingScreenText = computed(() => {
  if (loadingAuth.value) {
    return "Anmelden...";
  } else {
    return "Lade Daten...";
  }
});

function onAuthStateChanged() {
  if (loggedIn.value === true) {
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
  if (requires(router.currentRoute, "requiresAuth")) {
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
  if (databaseSchemaStore.updateIsRequired) {
    alert(
      `Update erforderlich.\nVersion von Database: ${databaseSchemaStore.remoteSchemaVersion}\nMaximal unterstützte Version von FeuerwehrApp: ${databaseSchemaStore.localSchemaVersion}`
    );
  }
}

watch(loggedIn, onAuthStateChanged);
watch(updateIsRequired, checkDatabaseSchemaVersion);

fetchDatabaseSchemaVersion();
onAuthStateChanged();
</script>
