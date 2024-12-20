<template>
  <BasePageCentered navdrawer>
    <LoginCard ask-for-persistence @input="handleLogin">
      <v-btn :to="{ name: 'UserPasswordResetRequest' }" text
        >Passwort vergessen</v-btn
      >
      <v-spacer />
      <v-btn type="submit" color="primary"> Anmelden </v-btn>
    </LoginCard>
  </BasePageCentered>
</template>

<script lang="ts">
import Vue from "vue";
import LoginCard from "@/components/user/LoginCard.vue";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { LoginCredentials } from "@/models/User";
import {
  getAuth,
  setPersistence,
  Persistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { firebaseApp } from "@/firebase";

const auth = getAuth(firebaseApp);

export default Vue.extend({
  components: {
    LoginCard,
  },

  computed: {
    ...mapState(useAuthStore, ["loggedIn"]),
    nextUrl(): string | null {
      return this.$route.params.nextUrl || null;
    },

    nextRouteName(): string | null {
      return this.$route.params.nextRouteName || null;
    },
  },

  watch: {
    loggedIn(loggedIn) {
      if (loggedIn) {
        if (this.nextUrl) {
          this.$router.replace(this.nextUrl);
        } else if (this.nextRouteName) {
          this.$router.replace({ name: this.nextRouteName });
        } else {
          this.$router.replace({ name: "Home" });
        }
      }
    },
  },

  methods: {
    ...mapActions(useAuthStore, ["login"]),

    handleLogin(user: LoginCredentials & { persist?: boolean }) {
      const persist: Persistence =
        user.persist === true
          ? browserLocalPersistence
          : browserSessionPersistence;

      setPersistence(auth, persist).then(() => {
        this.login(user);
      });
    },
  },
});
</script>
