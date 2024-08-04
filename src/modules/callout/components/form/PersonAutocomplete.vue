<template>
  <v-autocomplete
    :items="itemsForAutocomplete"
    item-text="id"
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
        <v-list-item-content>{{ data.item }}</v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title>
            {{ data.item.id }}
          </v-list-item-title>
          <template v-if="data.item.crewName">
            <v-list-item-subtitle>
              {{ data.item.crewName }}
            </v-list-item-subtitle>
          </template>
          <template v-else-if="data.item.status && data.item.status != 'Aktiv'">
            <v-list-item-subtitle>
              {{ data.item.status }}
            </v-list-item-subtitle>
          </template>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { PersonWithCrewName } from "../../models/Callout";

export default Vue.extend({
  props: {
    items: {
      type: Array as PropType<Array<PersonWithCrewName>>,
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
      search: null as object | null,
    };
  },

  computed: {
    itemsForAutocomplete(): Array<PersonWithCrewName & { disabled: boolean }> {
      return this.items.map((person) => {
        return { ...person, disabled: person.crewName != null };
      });
    },
  },

  methods: {
    onSelection(item: PersonWithCrewName) {
      if (item) {
        this.$emit("input", item);
        this.search = {};
      }
    },
  },
});
</script>
