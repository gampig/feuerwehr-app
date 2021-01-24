<template>
  <BasePageCentered navdrawer>
    <login-card ask-for-persistence @input="handleLogin">
      <v-btn :to="{ name: 'UserPasswordResetRequest' }" text
        >Passwort vergessen</v-btn
      >
      <v-spacer />
      <v-btn type="submit" color="primary"> Anmelden </v-btn>
    </login-card>
  </BasePageCentered>
</template>

<script>
import { mapActions, mapState } from "vuex";
import firebase from "firebase/app";
import LoginCard from "@/components/user/LoginCard";

export default {
  components: {
    LoginCard,
  },

  computed: {
    ...mapState("auth", ["loggedIn"]),
    nextUrl() {
      return this.$route.params.nextUrl || null;
    },
  },

  watch: {
    loggedIn(loggedIn) {
      if (loggedIn) {
        if (this.nextUrl) {
          this.$router.replace(this.nextUrl);
        } else {
          this.$router.replace({ name: "Home" });
        }
      }
    },
  },

  methods: {
    ...mapActions("auth", ["login"]),

    handleLogin(user) {
      const persist =
        user.persist === true
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION;

      firebase
        .auth()
        .setPersistence(persist)
        .then(() => {
          this.login(user);
        });
    },
  },
};
</script>
