<template>
  <BasePage v-bind="$attrs" back-button>
    <template #actions>
      <v-toolbar-items>
        <v-btn :loading="updating" text @click="$emit('submit')"
          >Speichern</v-btn
        >
      </v-toolbar-items>

      <v-menu bottom left>
        <template #activator="{ on, attrs }">
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

    <BaseConfirmDelete
      :visible="confirmDelete"
      :handle-delete="() => $emit('delete')"
      @close="confirmDelete = false"
    />
  </BasePage>
</template>

<script>
export default {
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
