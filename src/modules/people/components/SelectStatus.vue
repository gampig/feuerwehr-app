<template>
  <v-chip-group
    :model-value="selectedStatusIndex"
    selected-class="primary"
    mandatory
    column
    @update:model-value="changeStatus"
  >
    <v-chip v-for="status in availableStatusValues" :key="status">
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

  data() {
    return {
      availableStatusValues: ALL_PERSON_STATUS_VALUES,
      selectedStatusIndex: 0,
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
      this.selectedStatusIndex = this.availableStatusValues.indexOf(
        this.modelValue as PersonStatus
      );
    },

    changeStatus(newStatusIndex: number) {
      this.$emit(
        "update:model-value",
        this.availableStatusValues[newStatusIndex]
      );
    },
  },
});
</script>
