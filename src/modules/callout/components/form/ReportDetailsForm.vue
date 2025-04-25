<template>
  <v-form v-if="calloutStore.callout">
    <v-text-field
      label="Einsatzbeginn"
      :model-value="formatDateTime(calloutStore.callout.alarmTime)"
      disabled
    />
    <v-text-field
      label="Einsatzende"
      :model-value="formatDateTime(endTime)"
      disabled
    />

    <v-text-field label="Name Einheitsführer" />

    <v-textarea label="Verursacher (falls bekannt)" auto-grow />

    <v-textarea label="Kurzer Einsatzbericht (optional)" auto-grow />

    <v-textarea
      label="Schäden bzw. sonstige Informationen (optional)"
      auto-grow
    />
  </v-form>
</template>

<script lang="ts" setup>
import { formatDateTime } from "@/utils/dates";
import { useCalloutStore } from "../../stores/callout";
import { computed } from "vue";

const calloutStore = useCalloutStore();

const endTime = computed(() => {
  if (calloutStore.callout?.vehicles) {
    return Math.max(
      ...Object.values(calloutStore.callout.vehicles).map((vehicle) =>
        Number(vehicle.endTime)
      )
    );
  } else {
    return undefined;
  }
});
</script>
