<template>
  <div>
    <div class="btn-container">
      <slot />
      <v-btn v-if="handleShow" icon variant="text" @click="handleShow">
        <v-icon> mdi-eye </v-icon>
      </v-btn>
      <v-btn v-if="handleEdit" icon variant="text" @click="handleEdit">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
      <v-btn
        v-if="handleDelete"
        icon
        variant="text"
        @click="confirmDelete = true"
      >
        <v-icon> mdi-delete </v-icon>
      </v-btn>
    </div>
    <BaseConfirmDialog
      v-if="handleDelete"
      v-model="confirmDelete"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
export default {
  props: {
    handleShow: {
      type: Function,
      default: null,
    },

    handleEdit: {
      type: Function,
      default: null,
    },

    handleDelete: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      confirmDelete: false,
    };
  },
};
</script>

<style scoped>
.btn-container .v-btn {
  margin: 4px;
}
</style>
