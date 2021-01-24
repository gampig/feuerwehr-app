<template>
  <BasePageCentered navdrawer>
    <PasswordResetCard
      v-if="mode === 'resetPassword'"
      :loading="loading"
      @input="handleSubmit"
    />

    <h3 v-else>Modus unbekannt!</h3>
  </BasePageCentered>
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
