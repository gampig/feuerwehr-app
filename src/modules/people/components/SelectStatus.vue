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
import Vue from "vue";
import { ALL_PERSON_STATUS_VALUES } from "../../fireDepartment/models/Person";

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      availableStatusValues: ALL_PERSON_STATUS_VALUES,
      selectedStatusIndex: null as null | number,
    };
  },

  watch: {
    value(status) {
      if (status === null) this.selectedStatusIndex = null;
      else
        this.selectedStatusIndex = this.availableStatusValues.indexOf(status);
    },
  },

  methods: {
    changeStatus(newStatusIndex: number) {
      this.$emit("input", this.availableStatusValues[newStatusIndex]);
    },
  },
});
</script>
