<template>
  <BasePageCentered navdrawer>
    <PasswordResetRequestCard @input="handleRequest">
      <v-btn text @click="$router.back()">Zurück</v-btn>
      <v-spacer />
      <v-btn type="submit" :loading="loading" color="primary">
        Passwort zurücksetzen
      </v-btn>
    </PasswordResetRequestCard>
  </BasePageCentered>
</template>

<script lang="ts">
import Vue from "vue";
import PasswordResetRequestCard from "@/components/user/PasswordResetRequestCard.vue";
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default Vue.extend({
  components: {
    PasswordResetRequestCard,
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["requestReset"]),

    handleRequest(email: string) {
      this.loading = true;
      this.requestReset(email)
        .then(() => {
          this.$showMessage(
            "Es wurde eine E-Mail mit einem Link an dich versendet, um die Anfrage zu bestätigen."
          );
          this.$router.push({ name: "UserLogin" });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
