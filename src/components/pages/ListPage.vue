<template>
  <page v-bind="$attrs" close-button>
    <template v-slot:actions>
      <v-btn @click="reload" icon><v-icon>mdi-reload</v-icon></v-btn>

      <v-btn v-if="handleAdd" @click="handleAdd" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-container fluid>
      <SearchRow
        :search="search"
        @update:search="$emit('update:search', $event)"
      />

      <v-row>
        <v-col cols="12">
          <slot></slot>
        </v-col>
      </v-row>
    </v-container>
  </page>
</template>

<script>
import SearchRow from "../SearchRow";
import modules from "@/modules";

export default {
  props: {
    handleAdd: {
      default: null,
    },
    search: {
      default: "",
    },
  },

  components: { SearchRow },

  methods: {
    reload: () => modules.onLogin(),
  },
};
</script>
