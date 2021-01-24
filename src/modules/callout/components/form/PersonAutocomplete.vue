<template>
  <v-autocomplete
    :items="items"
    :item-text="getName"
    :value="search"
    auto-select-first
    return-object
    :label="label"
    :loading="loading"
    filled
    single-line
    @change="onSelection"
  >
    <template #item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title>
            {{ getName(data.item) }}
          </v-list-item-title>
          <v-list-item-subtitle
            v-if="data.item.status && data.item.status != 'Aktiv'"
          >
            {{ data.item.status }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import { getName } from "@/modules/fireDepartment/utils/people";

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: "Person suchen...",
    },
  },

  data() {
    return {
      search: null,
    };
  },

  methods: {
    getName,

    onSelection(item) {
      if (item) {
        this.$emit("input", item);
        this.search = {};
      }
    },
  },
};
</script>
