<template>
  <v-autocomplete
    :items="itemsForAutocomplete"
    item-title="id"
    :model-value="search"
    auto-select-first
    return-object
    :label="label"
    :loading="loading"
    variant="filled"
    single-line
    @update:model-value="onSelection"
  >
    <template #item="data">
      <template v-if="typeof data.item !== 'object'">
        {{ data.item }}
      </template>
      <template v-else>
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
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Person } from "@/modules/people/models/Person";
import { usePeopleStore } from "@/modules/people/stores/people";
import Vue from "vue";

export default Vue.extend({
  props: {
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
    itemsForAutocomplete(): Array<
      Person & { crewName?: string; disabled: boolean }
    > {
      const people: Person[] = usePeopleStore().peopleByActivity;

      const peopleWithCrewNames = people.map((item) => {
        const crewOfPerson = this.$store.getters["callout/findCrewOfPerson"](
          item.id
        ) as string | undefined;
        return {
          ...item,
          crewName: crewOfPerson,
          disabled: crewOfPerson != undefined,
        };
      });

      return peopleWithCrewNames.sort((a, b) => {
        if (a.disabled == b.disabled) {
          return 0;
        } else if (a.disabled && !b.disabled) {
          return 1;
        } else {
          return -1;
        }
      });
    },
  },

  methods: {
    onSelection(item: Person) {
      if (item) {
        this.$emit("input", item);
        this.search = {};
      }
    },
  },
});
</script>
