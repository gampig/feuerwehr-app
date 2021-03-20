<template>
  <BasePage v-bind="$attrs" close-button>
    <template #actions>
      <v-btn icon @click="reload"><v-icon>mdi-reload</v-icon></v-btn>

      <v-btn v-if="handleAdd" icon @click="handleAdd">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container fluid>
      <v-row>
        <slot name="topRow" />
      </v-row>

      <BaseSearchRow
        :search="search"
        @update:search="$emit('update:search', $event)"
      />

      <v-row>
        <v-col cols="12">
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script>
import modules from "@/modules";

export default {
  props: {
    handleAdd: {
      type: Function,
      default: null,
    },

    search: {
      type: String,
      default: "",
    },
  },

  methods: {
    reload: () => modules.onLogin(),
  },
};
</script>
