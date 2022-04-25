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

<script>
import { mapActions } from "vuex";
import Vue from "vue";
import PasswordResetRequestCard from "@/components/user/PasswordResetRequestCard";

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
    ...mapActions("auth", ["requestReset"]),

    handleRequest(request) {
      this.loading = true;
      this.requestReset(request)
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
