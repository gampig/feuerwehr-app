<template>
  <v-dialog v-bind="$attrs" width="500" v-on="$listeners">
    <LoginCard
      :card-title="user && (user.displayName || user.email)"
      no-email
      @input="submit"
    >
      <v-btn text @click="$emit('input', false)">Abbrechen</v-btn>
      <v-spacer />
      <v-btn type="submit" :loading="loading" color="primary"> Weiter </v-btn>
    </LoginCard>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
import firebase from "firebase/app";
import LoginCard from "./LoginCard";

export default {
  components: {
    LoginCard,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState("auth", ["user", "reauthenticationRequired"]),
  },

  methods: {
    ...mapActions("auth", ["reauthenticate"]),

    submit(formData) {
      this.loading = true;
      const cred = firebase.auth.EmailAuthProvider.credential(
        this.user.email,
        formData.password
      );
      this.reauthenticate(cred).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
