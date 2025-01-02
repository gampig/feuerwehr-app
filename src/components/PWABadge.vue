<template>
  <v-snackbar v-model="needRefresh" timeout="-1">
    {{ title }}

    <template #actions>
      <v-btn @click="updateServiceWorker()">Neu laden</v-btn>
      <v-btn icon="mdi-close" @click="close"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {
  needRefresh,
  updateServiceWorker,
} from "@/utils/registerServiceWorker";

const title =
  "Neues Update verfügbar. Klicke auf Neu laden, um die Änderungen anzuwenden.";

function close() {
  needRefresh.value = false;
}
</script>
