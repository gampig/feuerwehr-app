<template>
  <div>
    <v-stepper-step :step="index" :complete="value > index">
      {{ step && step.label }}
    </v-stepper-step>
    <v-stepper-content :step="index">
      <slot />
    </v-stepper-content>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import Vue, { PropType } from "vue";
import { StepperStep } from "@/models/StepperStep";
/* eslint-enable */

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 1,
    },

    index: {
      type: Number,
      default: 1,
    },

    step: {
      type: Object as PropType<StepperStep>,
      default: null,
    },
  },
});
</script>
