<template>
  <v-dialog :value="value" :width="width" @input="cancel">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot> Möchtest du diesen Eintrag wirklich löschen? </slot>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cancel"> Abbrechen </v-btn>
        <v-spacer />
        <v-btn color="primary" text @click="confirm"> {{ confirmText }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
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
      this.$emit("input", false);
      this.$emit("cancel");
    },

    confirm() {
      this.$emit("input", false);
      this.$emit("confirm");
    },
  },
};
</script>
