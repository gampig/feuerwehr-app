<template>
  <v-form v-if="calloutStore.callout">
    <v-expansion-panels
      multiple
      :model-value="Object.keys(calloutStore.vehiclesWithCrew)"
    >
      <v-expansion-panel
        v-for="vehicle in vehiclesStore.vehicles"
        :key="vehicle.id"
        :value="vehicle.id"
        :title="vehicle.name"
        :color="
          vehicle.id in calloutStore.vehiclesWithCrew ? 'secondary' : undefined
        "
      >
        <v-expansion-panel-text>
          <v-text-field
            label="Einsatzende"
            :model-value="
              calloutStore.vehiclesWithCrew[vehicle.id]?.calloutDetails
                ? formatDateTime(
                    Number(
                      calloutStore.vehiclesWithCrew[vehicle.id].calloutDetails
                        ?.endTime
                    )
                  )
                : undefined
            "
          />
          <v-number-input label="Gefahrene Kilometer" type="number" :min="0" />
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                Anzahl Personal:
                {{
                  calloutStore.vehiclesWithCrew[vehicle.id]?.crewMembers
                    ? Object.keys(
                        calloutStore.vehiclesWithCrew[vehicle.id].crewMembers
                      ).length
                    : 0
                }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item
                    v-for="crewMember in calloutStore.vehiclesWithCrew[
                      vehicle.id
                    ]?.crewMembers
                      ? Object.keys(
                          calloutStore.vehiclesWithCrew[vehicle.id].crewMembers
                        )
                      : []"
                    :key="crewMember"
                  >
                    {{ crewMember }}
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <br />

    <v-textarea label="Eingesetzte Gerätschaften (optional)" auto-grow />
  </v-form>
</template>

<script lang="ts" setup>
import { formatDateTime } from "@/utils/dates";
import { useCalloutStore } from "../../stores/callout";
import { useVehiclesStore } from "@/modules/vehicles/stores/vehicles";

const calloutStore = useCalloutStore();
const vehiclesStore = useVehiclesStore();
</script>
