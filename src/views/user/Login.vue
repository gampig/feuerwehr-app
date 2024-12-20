<template>
  <BasePageCentered navdrawer>
    <v-form ref="form">
      <LoginCard
        v-model:email="email"
        v-model:password="password"
        v-model:persist="persist"
        ask-for-persistence
        @on-submit="handleLogin"
      >
        <v-btn :to="{ name: 'UserPasswordResetRequest' }" variant="text">
          Passwort vergessen
        </v-btn>
        <v-spacer />
        <v-btn color="primary" @click="handleLogin"> Anmelden </v-btn>
      </LoginCard>
    </v-form>
  </BasePageCentered>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginCard from "@/components/user/LoginCard.vue";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";
import handleError from "@/utils/store/handleError";
import { VForm } from "vuetify/components";
import {
  getAuth,
  setPersistence,
  Persistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { firebaseApp } from "@/firebase";

const auth = getAuth(firebaseApp);

export default defineComponent({
  components: {
    LoginCard,
  },

  data() {
    return {
      email: "",
      password: "",
      persist: false,
    };
  },

  computed: {
    ...mapState(useAuthStore, ["loggedIn"]),
    nextUrl(): string | null {
      return (this.$route.query.next || null) as string | null;
    },
  },

  watch: {
    loggedIn() {
      this.onLoginStateChanged();
    },
  },

  methods: {
    ...mapActions(useAuthStore, ["login"]),

    onLoginStateChanged() {
      if (this.loggedIn)
        if (this.nextUrl) {
          this.$router.replace(this.nextUrl);
        } else {
          this.$router.replace({ name: "Home" });
        }
    },

    async handleLogin() {
      if ((await (this.$refs.form as VForm).validate()).valid) {
        const persist: Persistence =
          this.persist === true
            ? browserLocalPersistence
            : browserSessionPersistence;

        setPersistence(auth, persist)
          .then(() => {
            return this.login({ email: this.email, password: this.password });
          })
          .catch(handleError);
      }
    },
  },
});
</script>
