<template>
  <BasePageCentered navdrawer>
    <v-card v-if="mode === 'resetPassword'">
      <v-form ref="form">
        <v-card-title>Neues Passwort setzen</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newPassword"
            type="password"
            label="Neues Passwort"
            :rules="passwordRules"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn :loading="loading" color="primary" @click="handleSubmit">
            Passwort speichern
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <h3 v-else>Modus unbekannt!</h3>
  </BasePageCentered>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VForm } from "vuetify/components/VForm";
import { mapActions } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  data() {
    return {
      loading: false,
      newPassword: undefined as string | undefined,
      passwordRules: [(v: any) => !!v || "Bitte Passwort eingeben"],
    };
  },

  computed: {
    mode() {
      return this.$route.query.mode;
    },

    code() {
      return this.$route.query.oobCode as string;
    },
  },

  methods: {
    ...mapActions(useAuthStore, ["reset"]),

    async handleSubmit() {
      const form = this.$refs.form as VForm;
      if (form && (await form.validate()).valid && this.newPassword) {
        if (typeof this.code !== "string") {
          throw new Error("Code must be a string");
        }

        this.loading = true;
        try {
          await this.reset({
            newPassword: this.newPassword,
            code: this.code,
          });
          this.$router.push({ name: "UserLogin" });
          this.$showMessage("Passwort wurde erfolgreich geändert.");
        } finally {
          this.loading = false;
        }
      }
    },
  },
});
</script>
