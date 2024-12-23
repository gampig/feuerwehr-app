<template>
  <v-dialog
    :model-value="modelValue"
    :width="width"
    @update:model-value="cancel"
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot> Möchtest du diesen Eintrag wirklich löschen? </slot>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="confirm">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    width: {
      type: String,
      default: "300",
    },

    title: {
      type: String,
      default: "",
    },

    confirmText: {
      type: String,
      default: "Löschen",
    },
  },

  methods: {
    cancel() {
      this.$emit("update:model-value", false);
      this.$emit("cancel");
    },

    confirm() {
      this.$emit("update:model-value", false);
      this.$emit("confirm");
    },
  },
};
</script>
