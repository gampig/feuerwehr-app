<template>
  <v-app id="feuerwehr-app">
    <router-view />
    <Loading :visible="loading" :text="loadingScreenText" />
  </v-app>
</template>

<script>
import version from "@/utils/version";
import modules from "./modules";
import Loading from "@/components/Loading";
import { requires } from "./utils/routerAuth";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "./stores/auth";
import { useDatabaseSchemaStore } from "./stores/databaseSchema";

export default {
  components: { Loading },

  computed: {
    ...mapState(useAuthStore, { loadingAuth: "loading", loggedIn: "loggedIn" }),
    ...mapState(useDatabaseSchemaStore, {
      loadingDatabaseSchemaVersion: "loading",
      updateIsRequired: "updateIsRequired",
    }),

    loading() {
      return this.loadingAuth || this.loadingDatabaseSchemaVersion;
    },

    loadingScreenText() {
      if (this.loadingAuth) {
        return "Anmelden...";
      } else {
        return "Lade Daten...";
      }
    },
  },

  watch: {
    loggedIn() {
      this.onAuthStateChanged();
    },

    updateIsRequired() {
      this.checkDatabaseSchemaVersion();
    },
  },

  created() {
    this.fetchDatabaseSchemaVersion();
    this.onAuthStateChanged();
  },

  methods: {
    ...mapActions(useAuthStore, ["updateClientMetadata"]),

    onAuthStateChanged() {
      if (this.loggedIn === true) {
        this.onLogin();
      } else if (this.loggedIn === false) {
        this.onLogout();
      }
    },

    onLogin() {
      modules.onLogin();

      const lastOnline = new Date().toISOString();
      this.updateClientMetadata({
        lastOnline,
        version,
      });
    },

    onLogout() {
      modules.onLogout();
      this.toLoginPage();
    },

    toLoginPage() {
      if (requires(this.$route, "requiresAuth")) {
        this.$router.replace({
          name: "UserLogin",
          params: { nextUrl: { name: "Home" } },
        });
      }
    },

    fetchDatabaseSchemaVersion() {
      useDatabaseSchemaStore().bind();
    },

    checkDatabaseSchemaVersion() {
      const store = useDatabaseSchemaStore();
      if (store.updateIsRequired) {
        alert(
          `Update erforderlich.\nVersion von Database: ${store.remoteSchemaVersion}\nMaximal unterstützte Version von FeuerwehrApp: ${store.localSchemaVersion}`
        );
      }
    },
  },
};
</script>
