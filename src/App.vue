<template>
  <v-app id="feuerwehr-app">
    <router-view />
    <Loading :visible="loading" text="Anmelden..." />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import version from "@/utils/version";
import modules from "./modules";
import Loading from "@/components/Loading";

export default {
  components: { Loading },

  computed: {
    ...mapState("auth", ["loggedIn", "loading"]),
  },

  watch: {
    loggedIn() {
      this.onStateChanged();
    },

    loading() {
      this.onStateChanged();
    },
  },

  methods: {
    onStateChanged() {
      if (!this.loading) {
        if (this.loggedIn) {
          this.onLogin();
        } else {
          this.onLogout();
        }
      }
    },

    onLogin() {
      modules.onLogin();

      const lastOnline = new Date().toISOString();
      this.$store.dispatch("auth/updateClientMetadata", {
        lastOnline,
        version,
      });
    },

    onLogout() {
      modules.onLogout();
      this.toLoginPage();
    },

    toLoginPage() {
      if (this.$route.name == "Home") {
        this.$router.push({ name: "UserLogin" });
      }
    },
  },
};
</script>
