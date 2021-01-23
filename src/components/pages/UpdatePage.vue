<template>
  <page v-bind="$attrs" back-button>
    <template v-slot:actions>
      <v-toolbar-items>
        <v-btn @click="$emit('submit')" :loading="updating" text
          >Speichern</v-btn
        >
      </v-toolbar-items>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$emit('reset')">
            <v-list-item-title>Zurücksetzen</v-list-item-title>
          </v-list-item>
          <v-list-item @click="confirmDelete = true">
            <v-list-item-title>Löschen</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-container>
      <v-card :loading="loading">
        <v-card-text>
          <slot></slot>
        </v-card-text>
      </v-card>
    </v-container>

    <ConfirmDelete
      :visible="confirmDelete"
      :handle-delete="() => $emit('delete')"
      @close="confirmDelete = false"
    />
  </page>
</template>

<script>
import ConfirmDelete from "@/components/dialogs/ConfirmDelete";

export default {
  components: {
    ConfirmDelete,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    updating: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      confirmDelete: false,
    };
  },
};
</script>
