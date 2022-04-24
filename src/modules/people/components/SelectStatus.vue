<template>
  <v-chip-group
    :value="selectedStatusIndex"
    active-class="primary"
    mandatory
    column
    @change="changeStatus"
  >
    <v-chip v-for="status in availableStatusValues" :key="status">
      {{ status }}
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import Vue, { PropType } from "vue";
import { ALL_PERSON_STATUS_VALUES, PersonStatus } from "../models/Person";
/* eslint-enable */

export default Vue.extend({
  props: {
    value: {
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
    value() {
      this.loadData();
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.selectedStatusIndex = this.availableStatusValues.indexOf(
        this.value as PersonStatus
      );
    },

    changeStatus(newStatusIndex: number) {
      this.$emit("input", this.availableStatusValues[newStatusIndex]);
    },
  },
});
</script>
