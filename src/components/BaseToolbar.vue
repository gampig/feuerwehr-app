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
    <BaseConfirmDelete
      v-if="handleDelete"
      :visible="confirmDelete"
      :handle-delete="handleDelete"
      @close="confirmDelete = false"
    />
  </v-toolbar>
</template>

<script>
export default {
  props: {
    handleSubmit: {
      type: Function,
      required: false,
    },
    handleReset: {
      type: Function,
      required: false,
    },
    handleDelete: {
      type: Function,
      required: false,
    },
    handleAdd: {
      type: Function,
      required: false,
    },
    title: {
      type: String,
      required: false,
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
