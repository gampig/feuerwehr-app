<template>
  <v-dialog
    :model-value="modelValue"
    persistent
    :max-width="maxWidth"
    @update:model-value="cancel"
  >
    <v-card :loading="loading">
      <v-card-title>{{ title }}</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn variant="text" @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn :loading="saving" color="primary" variant="text" @click="save">
          Speichern
        </v-btn>
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
      required: true,
    },

    maxWidth: {
      type: String,
      default: "900",
    },

    title: {
      type: String,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    saving: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:model-value", "save"],

  methods: {
    cancel() {
      this.$emit("update:model-value", false);
    },

    save() {
      this.$emit("save");
    },
  },
});
</script>
