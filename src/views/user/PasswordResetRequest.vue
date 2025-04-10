<template>
  <BasePageCentered navdrawer>
    <v-card>
      <VForm ref="form">
        <v-card-title>Passwort zurücksetzen</v-card-title>

        <v-card-text>
          <v-text-field v-model="email" label="E-Mail" :rules="emailRules" />
        </v-card-text>

        <v-card-actions>
          <v-btn variant="text" @click="$router.back()">Zurück</v-btn>
          <v-spacer />
          <v-btn :loading="loading" color="primary" @click="submit">
            Passwort zurücksetzen
          </v-btn>
        </v-card-actions>
      </VForm>
    </v-card>
  </BasePageCentered>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VForm } from "vuetify/components/VForm";
import { useAuthStore } from "@/stores/auth";
import { showMessage } from "@/utils/notifications";
import { useRouter } from "vue-router";

const form = ref<VForm>();
const loading = ref(false);
const email = ref<string>();

const emailRules = [(v: any) => !!v || "Bitte E-Mail-Adresse eingeben"];

const router = useRouter();

async function submit() {
  if (form.value && (await form.value.validate()).valid && email.value) {
    loading.value = true;
    try {
      await useAuthStore().requestReset(email.value);
      showMessage(
        "Es wurde eine E-Mail mit einem Link an dich versendet, um die Anfrage zu bestätigen."
      );
      router.push({ name: "UserLogin" });
    } finally {
      loading.value = false;
    }
  }
}
</script>
