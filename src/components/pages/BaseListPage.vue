<template>
  <BasePage v-bind="$attrs" close-button>
    <template #actions>
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

  emits: ["update:search"],
};
</script>
