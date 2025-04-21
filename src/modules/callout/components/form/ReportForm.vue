<template>
  <v-container fluid>
    <v-form v-if="calloutStore.callout">
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Einsatzbeginn"
            :model-value="formatDateTime(calloutStore.callout.alarmTime)"
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
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Schlagwort"
            :model-value="calloutStore.callout.catchphrase"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Einsatzort"
            :model-value="calloutStore.callout.address"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
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
                vehicle.id in calloutStore.vehiclesWithCrew
                  ? 'success'
                  : undefined
              "
            >
              <v-expansion-panel-text>
                <v-text-field
                  label="Einsatzende"
                  :model-value="
                    calloutStore.vehiclesWithCrew[vehicle.id]?.calloutDetails
                      ? formatDateTime(
                          Number(
                            calloutStore.vehiclesWithCrew[vehicle.id]
                              .calloutDetails?.endTime
                          )
                        )
                      : undefined
                  "
                />
                <v-text-field label="Gefahrene Kilometer" type="number" />
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      Anzahl Personal:
                      {{
                        calloutStore.vehiclesWithCrew[vehicle.id]?.crewMembers
                          ? Object.keys(
                              calloutStore.vehiclesWithCrew[vehicle.id]
                                .crewMembers
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
                                calloutStore.vehiclesWithCrew[vehicle.id]
                                  .crewMembers
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
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-textarea label="Eingesetzte Gerätschaften" rows="1" auto-grow />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            label="Schäden bzw. sonstige Informationen"
            rows="1"
            auto-grow
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea label="Kurzer Einsatzbericht" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea label="Verursacher (falls bekannt)" rows="1" auto-grow />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field label="Name Einheitsführer" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-btn color="primary">Abschließen & Versenden</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { formatDateTime } from "@/utils/dates";
import { useCalloutStore } from "../../stores/callout";
import { computed } from "vue";
import { useVehiclesStore } from "@/modules/vehicles/stores/vehicles";

const calloutStore = useCalloutStore();
const vehiclesStore = useVehiclesStore();

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
