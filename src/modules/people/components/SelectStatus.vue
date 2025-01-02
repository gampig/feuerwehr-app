<template>
  <v-chip-group
    :model-value="selectedStatus"
    selected-class="bg-primary"
    mandatory
    column
    @update:model-value="changeStatus"
  >
    <v-chip
      v-for="status in availableStatusValues"
      :key="status"
      :value="status"
    >
      {{ status }}
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ALL_PERSON_STATUS_VALUES, PersonStatus } from "../models/Person";

export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<PersonStatus>,
      default: "Aktiv",
    },
  },

  emits: ["update:model-value"],

  data() {
    return {
      availableStatusValues: ALL_PERSON_STATUS_VALUES,
      selectedStatus: undefined as PersonStatus | undefined,
    };
  },

  watch: {
    modelValue() {
      this.loadData();
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.selectedStatus = this.modelValue;
    },

    changeStatus(newStatus: PersonStatus) {
      this.$emit("update:model-value", newStatus);
    },
  },
});
</script>
