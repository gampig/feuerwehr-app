<template>
  <v-dialog v-model="show" width="300">
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text> Möchtest du diesen Eintrag wirklich löschen? </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" text @click="handleDelete"> Löschen </v-btn>
        <v-btn text @click.stop="show = false"> Abbrechen </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDelete",
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    handleDelete: {
      type: Function,
      required: true,
    },
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
};
</script>
