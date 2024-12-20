<template>
  <BasePageCentered navdrawer>
    <PasswordResetCard
      v-if="mode === 'resetPassword'"
      :loading="loading"
      @update:model-value="handleSubmit"
    />

    <h3 v-else>Modus unbekannt!</h3>
  </BasePageCentered>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PasswordResetCard from "@/components/user/PasswordResetCard.vue";
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
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
    ...mapActions(useAuthStore, ["reset"]),

    handleSubmit(newPassword: string) {
      if (typeof this.code !== "string") {
        throw new Error("Code must be a string");
      }

      this.loading = true;
      this.reset({
        newPassword,
        code: this.code,
      })
        .then(() => {
          this.$router.push({ name: "UserLogin" });
          this.$showMessage("Passwort wurde erfolgreich geändert.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
</script>
