<template>
  <v-dialog v-bind="$attrs" width="500" v-on="$listeners">
    <LoginCard
      :card-title="user && (user.displayName || user.email)"
      no-email
      @input="submit"
    >
      <v-btn variant="text" @click="$emit('input', false)">Abbrechen</v-btn>
      <v-spacer />
      <v-btn type="submit" :loading="loading" color="primary"> Weiter </v-btn>
    </LoginCard>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import firebase from "firebase/app";
import LoginCard from "./LoginCard.vue";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  components: {
    LoginCard,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapState(useAuthStore, ["user", "reauthenticationRequired"]),
  },

  methods: {
    ...mapActions(useAuthStore, ["reauthenticate"]),

    submit(formData: { password: string }) {
      if (this.user === null || this.user.email === null) {
        throw new Error("User cannot be null");
      }

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
});
</script>
