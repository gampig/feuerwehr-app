<template>
  <page-centered navdrawer>
    <password-reset-request-card @input="handleRequest">
      <v-btn @click="$router.back()" text>Zurück</v-btn>
      <v-spacer />
      <v-btn type="submit" :loading="loading" color="primary">
        Passwort zurücksetzen
      </v-btn>
    </password-reset-request-card>
  </page-centered>
</template>

<script>
import { mapActions } from "vuex";
import NotificationMixin from "@/mixins/NotificationMixin";
import PasswordResetRequestCard from "@/components/user/PasswordResetRequestCard";

export default NotificationMixin.extend({
  components: {
    PasswordResetRequestCard,
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    ...mapActions("auth", ["requestReset"]),

    handleRequest(request) {
      this.loading = true;
      this.requestReset(request)
        .then(() => {
          this.showMessage(
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
