<template>
  <v-dialog :model-value="modelValue" width="500" persistent>
    <v-card>
      <v-card-title>Fehler</v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions>
        <v-btn variant="text" @click="goBack">Zurück</v-btn>
        <v-spacer />
        <v-btn variant="text" @click="tryAgain">Erneut versuchen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:model-value", "retry"],

  methods: {
    goBack() {
      this.$emit("update:model-value", false);
      this.$router.back();
    },

    tryAgain() {
      this.$emit("update:model-value", false);
      this.$emit("retry");
    },
  },
});
</script>
