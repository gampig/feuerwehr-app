<template>
  <v-card v-bind="$attrs" append-inner>
    <v-img
      v-if="modelValue.pictureUrl"
      :src="modelValue.pictureUrl"
      :alt="modelValue.name"
    />

    <v-card-title>
      {{ modelValue.name }}
    </v-card-title>

    <v-card-subtitle v-if="modelValue.crewNumber" class="text-subtitle-1">
      Mannschaft: {{ modelValue.crewNumber ?? "0" }}
      <span v-if="modelValue.maxCrewNumber" class="text-overline"
        >/{{ modelValue.maxCrewNumber }}
      </span>
      Personen
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import { VehicleInCallout } from "@/modules/vehicles/models/Vehicle";

const { modelValue } = defineProps<{ modelValue: VehicleInCallout }>();
</script>
