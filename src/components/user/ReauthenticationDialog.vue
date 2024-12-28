<template>
  <v-dialog v-bind="$attrs" width="500">
    <v-form ref="form">
      <LoginCard
        v-model:password="password"
        :card-title="(user && (user.displayName || user.email)) || undefined"
        no-email
      >
        <v-btn variant="text" @click="$emit('update:model-value', false)">
          Abbrechen
        </v-btn>
        <v-spacer />
        <v-btn :loading="loading" color="primary" @click="submit">
          Weiter
        </v-btn>
      </LoginCard>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginCard from "./LoginCard.vue";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { VForm } from "vuetify/components";
import { EmailAuthProvider } from "firebase/auth";

export default defineComponent({
  components: {
    LoginCard,
  },

  data() {
    return {
      loading: false,
      password: "",
    };
  },

  computed: {
    ...mapState(useAuthStore, ["user", "reauthenticationRequired"]),
  },

  methods: {
    ...mapActions(useAuthStore, ["reauthenticate"]),

    async submit() {
      if ((await (this.$refs.form as VForm).validate()).valid) {
        if (this.user?.email == null) {
          throw new Error("User cannot be null");
        }

        this.loading = true;
        const cred = EmailAuthProvider.credential(
          this.user.email,
          this.password
        );
        this.reauthenticate(cred).finally(() => {
          this.loading = false;
        });
      }
    },
  },
});
</script>
