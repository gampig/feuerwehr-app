<template>
  <v-dialog :value="value" persistent :max-width="maxWidth" @input="cancel">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn :loading="loading" color="primary" text @click="save">
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    value: {
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
      required: true,
    },
  },

  methods: {
    cancel() {
      this.$emit("input", false);
    },

    save() {
      this.$emit("create");
    },
  },
});
</script>
