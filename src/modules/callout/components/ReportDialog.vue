<template>
  <v-dialog
    :model-value="modelValue"
    fullscreen
    @update:model-value="emit('update:model-value')"
  >
    <v-card>
      <v-toolbar>
        <v-btn icon="mdi-close" @click="emit('update:model-value', false)" />

        <v-toolbar-title>Einsatzbericht</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <v-form v-if="calloutStore.callout">
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Einsatzbeginn"
                :model-value="formatDateTime(calloutStore.callout.alarmTime)"
                disabled
                hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Einsatzende"
                :model-value="formatDateTime(endTime)"
                disabled
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Stichwort"
                :model-value="calloutStore.callout.keyword"
                disabled
                hide-details
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Schlagwort"
                :model-value="calloutStore.callout.catchphrase"
                disabled
                hide-details
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                label="Einsatzort"
                :model-value="calloutStore.callout.address"
                disabled
                hide-details
              />
            </v-col>
          </v-row>

          <v-row>
            <template
              v-for="(
                vehicleWithCrew, vehicleId
              ) in calloutStore.vehiclesWithCrew"
              :key="vehicleId"
            >
              <v-col>
                <v-card>
                  <v-card-title>
                    {{ vehicleWithCrew.vehicle.name }}
                  </v-card-title>
                  <v-list>
                    <v-list-item v-if="vehicleWithCrew.calloutDetails">
                      Einsatzende:
                      {{
                        formatDateTime(
                          Number(vehicleWithCrew.calloutDetails?.endTime)
                        )
                      }}
                    </v-list-item>
                    <v-list-item>
                      Anzahl Personal:
                      {{ Object.keys(vehicleWithCrew.crewMembers).length }}
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { formatDateTime } from "@/utils/dates";
import { useCalloutStore } from "../stores/callout";
import { computed } from "vue";

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:model-value"]);

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
