<template>
  <VAutocomplete
    ref="autocomplete"
    :items="itemsForAutocomplete"
    item-title="id"
    :model-value="search"
    auto-select-first
    return-object
    :placeholder="label"
    :loading="loading"
    variant="filled"
    @update:model-value="onSelection"
  >
    <template #item="data">
      <template v-if="typeof data.item !== 'object'">
        {{ data.item }}
      </template>
      <v-list-item
        v-else
        v-bind="data.props"
        :title="data.item.raw.id"
        :disabled="data.item.raw.disabled"
      >
        <v-list-item-subtitle v-if="data.item.raw.crewName">
          {{ data.item.raw.crewName }}
        </v-list-item-subtitle>
        <v-list-item-subtitle
          v-else-if="data.item.raw.status && data.item.raw.status != 'Aktiv'"
        >
          {{ data.item.raw.status }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </VAutocomplete>
</template>

<script setup lang="ts">
import { Person } from "@/modules/people/models/Person";
import { usePeopleStore } from "@/modules/people/stores/people";
import { computed, ref } from "vue";
import { VAutocomplete } from "vuetify/components";
import { useStore } from "vuex";

type ExtendedPerson = Person & { crewName?: string; disabled: boolean };

const emit = defineEmits(["update:model-value"]);

const { loading = false, label = "Person suchen..." } = defineProps<{
  loading?: boolean;
  label?: string;
}>();

const autocomplete = ref<VAutocomplete>();
const search = ref<ExtendedPerson | null>(null);
const store = useStore();

const itemsForAutocomplete = computed((): ExtendedPerson[] => {
  const people: Person[] = usePeopleStore().peopleByActivity;

  const peopleWithCrewNames = people.map((item) => {
    const crewOfPerson = store.getters["callout/findCrewOfPerson"](item.id) as
      | string
      | undefined;
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
});

function onSelection(item?: Person) {
  if (item) {
    emit("update:model-value", item);
    search.value = null;
    autocomplete.value?.blur();
  }
}
</script>
