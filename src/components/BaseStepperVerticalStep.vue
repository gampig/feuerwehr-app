<template>
  <div>
    <v-stepper-step :step="index" :complete="modelValue > index">
      {{ step && step.label }}
    </v-stepper-step>
    <v-stepper-content :step="index">
      <slot />
    </v-stepper-content>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { StepperStep } from "@/models/StepperStep";

export default defineComponent({
  props: {
    modelValue: {
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
