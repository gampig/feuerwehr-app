<template>
  <BasePageCentered page-title="Passwort ändern" navdrawer>
    <v-form @submit.prevent="submit">
      <v-card :disabled="loading">
        <v-card-text>
          <v-text-field
            v-model="newPassword"
            label="Neues Passwort"
            type="password"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" :loading="loading" color="primary">
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <ReauthenticationDialog
      :value="reauthenticationRequired"
      @input="onDialogInput"
    ></ReauthenticationDialog>
  </BasePageCentered>
</template>

<script lang="ts">
import Vue from "vue";
import ReauthenticationDialog from "@/components/user/ReauthenticationDialog.vue";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default Vue.extend({
  components: {
    ReauthenticationDialog,
  },

  data() {
    return {
      loading: false,
      newPassword: "",
    };
  },

  computed: {
    ...mapState(useAuthStore, ["reauthenticationRequired"]),
  },

  methods: {
    ...mapActions(useAuthStore, [
      "updatePassword",
      "setReauthenticationRequired",
    ]),

    submit() {
      this.loading = true;
      this.updatePassword(this.newPassword)
        .then(() => {
          this.newPassword = "";
          this.$showMessage("Passwort wurde geändert.");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onDialogInput(open: boolean) {
      if (!open) {
        if (this.reauthenticationRequired) {
          this.setReauthenticationRequired(false);
        } else {
          this.submit();
        }
      }
    },
  },
});
</script>
