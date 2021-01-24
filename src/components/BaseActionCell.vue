<template>
  <div>
    <div class="btn-container">
      <v-btn v-if="handleShow" icon @click="handleShow">
        <v-icon> mdi-eye </v-icon>
      </v-btn>
      <v-btn v-if="handleEdit" icon @click="handleEdit">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
      <v-btn v-if="handleDelete" icon @click="confirmDelete = true">
        <v-icon> mdi-delete </v-icon>
      </v-btn>
    </div>
    <BaseConfirmDelete
      v-if="handleDelete"
      :visible="confirmDelete"
      :handle-delete="handleDelete"
      @close="confirmDelete = false"
    />
  </div>
</template>

<style scoped>
.btn-container .v-btn {
  margin: 4px;
}
</style>

<script>
export default {
  props: {
    handleShow: {
      type: Function,
      required: false,
    },
    handleEdit: {
      type: Function,
      required: false,
    },
    handleDelete: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      confirmDelete: false,
    };
  },
};
</script>
