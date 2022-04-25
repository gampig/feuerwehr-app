<template>
  <v-toolbar flat>
    <slot name="left" />
    <v-spacer class="ma-1" />
    <div>
      <v-btn
        v-if="handleSubmit"
        :loading="isLoading"
        color="primary"
        @click="submitItem"
      >
        Speichern
      </v-btn>
      <v-btn v-if="handleReset" text @click="resetItem"> Zurücksetzen </v-btn>
      <v-btn
        v-if="handleDelete"
        color="secondary"
        class="ml-sm-2"
        @click="confirmDelete = true"
      >
        Löschen
      </v-btn>

      <v-btn v-if="handleAdd" color="secondary" @click="addItem">
        <v-icon left>mdi-plus</v-icon> Neu
      </v-btn>
    </div>
    <BaseConfirmDialog
      v-if="handleDelete"
      v-model="confirmDelete"
      @confirm="handleDelete"
    />
  </v-toolbar>
</template>

<script>
export default {
  props: {
    handleSubmit: {
      type: Function,
      default: null,
    },

    handleReset: {
      type: Function,
      default: null,
    },

    handleDelete: {
      type: Function,
      default: null,
    },

    handleAdd: {
      type: Function,
      default: null,
    },

    title: {
      type: String,
      default: null,
    },

    isLoading: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  data() {
    return {
      confirmDelete: false,
    };
  },

  methods: {
    addItem() {
      if (this.handleAdd) {
        this.handleAdd();
      }
    },

    submitItem() {
      if (this.handleSubmit) {
        this.handleSubmit();
      }
    },

    resetItem() {
      if (this.handleReset) {
        this.handleReset();
      }
    },
  },
};
</script>
