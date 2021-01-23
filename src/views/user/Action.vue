<template>
  <page-centered navdrawer>
    <password-reset-card
      v-if="mode === 'resetPassword'"
      @input="handleSubmit"
      :loading="loading"
    />

    <h3 v-else>Modus unbekannt!</h3>
  </page-centered>
</template>

<script>
import { mapActions } from "vuex";
import PasswordResetCard from "@/components/user/PasswordResetCard";

export default {
  components: {
    PasswordResetCard,
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    mode() {
      return this.$route.query.mode;
    },
    code() {
      return this.$route.query.oobCode;
    },
  },

  methods: {
    ...mapActions("auth", ["reset"]),

    handleSubmit(newPassword) {
      this.loading = true;
      this.reset({
        newPassword,
        code: this.code,
      })
        .then(() => {
          this.$router.push({ name: "UserLogin" });
          this.showMessage("Passwort wurde erfolgreich geändert.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
