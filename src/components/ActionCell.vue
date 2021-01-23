<template>
  <div>
    <div class="btn-container">
      <v-btn v-if="handleShow" @click="handleShow" icon>
        <v-icon> mdi-eye </v-icon>
      </v-btn>
      <v-btn v-if="handleEdit" @click="handleEdit" icon>
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
      <v-btn v-if="handleDelete" @click="confirmDelete = true" icon>
        <v-icon> mdi-delete </v-icon>
      </v-btn>
    </div>
    <ConfirmDelete
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
import ConfirmDelete from "./dialogs/ConfirmDelete";

export default {
  name: "ActionCell",
  components: {
    ConfirmDelete,
  },
  data() {
    return {
      confirmDelete: false,
    };
  },
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
};
</script>
