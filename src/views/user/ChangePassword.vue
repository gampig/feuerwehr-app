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

    <reauthentication-dialog
      :value="reauthenticationRequired"
      @input="onDialogInput"
    ></reauthentication-dialog>
  </BasePageCentered>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import NotificationMixin from "@/mixins/NotificationMixin";
import ReauthenticationDialog from "@/components/user/ReauthenticationDialog";

export default NotificationMixin.extend({
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
    ...mapState("auth", ["reauthenticationRequired"]),
  },

  methods: {
    ...mapActions("auth", ["updatePassword"]),
    ...mapMutations("auth", ["reauthenticated"]),

    submit() {
      this.loading = true;
      this.updatePassword(this.newPassword)
        .then(() => {
          this.newPassword = "";
          this.showMessage("Passwort wurde geändert.");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onDialogInput(open) {
      if (!open) {
        if (this.reauthenticationRequired) {
          this.reauthenticated();
        } else {
          this.submit();
        }
      }
    },
  },
});
</script>
