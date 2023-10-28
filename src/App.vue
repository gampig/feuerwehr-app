<template>
  <v-app id="feuerwehr-app">
    <router-view />
    <Loading :visible="loading" text="Anmelden..." />
  </v-app>
</template>

<script>
import version from "@/utils/version";
import modules from "./modules";
import Loading from "@/components/Loading";
import { requires } from "./utils/routerAuth";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "./stores/auth";

export default {
  components: { Loading },

  computed: {
    ...mapState(useAuthStore, ["loading", "loggedIn"]),
  },

  watch: {
    loggedIn() {
      this.onStateChanged();
    },
  },

  created() {
    this.onStateChanged();
  },

  methods: {
    ...mapActions(useAuthStore, ["updateClientMetadata"]),

    onStateChanged() {
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
  },
};
</script>
