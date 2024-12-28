<template>
  <CrewPage page-title="Fahrzeug auswählen">
    <v-row v-if="sortedVehicles.used.length > 0">
      <v-col
        v-for="vehicle in sortedVehicles.used"
        :key="vehicle.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <VehicleCard
          :model-value="vehicle"
          color="secondary"
          dark
          @click="selectVehicle(vehicle.id)"
        >
        </VehicleCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="vehicle in sortedVehicles.active"
        :key="vehicle.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <VehicleCard :model-value="vehicle" @click="selectVehicle(vehicle.id)">
        </VehicleCard>
      </v-col>
    </v-row>

    <v-row v-if="sortedVehicles.inactive.length > 0">
      <v-col cols="12">
        <v-btn
          block
          @click="showAllInactiveVehicles = !showAllInactiveVehicles"
        >
          Ehemalige Fahrzeuge
          <v-icon end>{{
            showAllInactiveVehicles ? "mdi-chevron-up" : "mdi-chevron-down"
          }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-row v-show="showAllInactiveVehicles">
        <v-col
          v-for="vehicle in sortedVehicles.inactive"
          :key="vehicle.id"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <VehicleCard
            :model-value="vehicle"
            @click="selectVehicle(vehicle.id)"
          >
          </VehicleCard>
        </v-col>
      </v-row>
    </v-expand-transition>
  </CrewPage>
</template>

<script lang="ts">
import { mapState } from "pinia";
import CrewPage from "../../components/CrewPage.vue";
import VehicleCard from "../../components/cards/VehicleCard.vue";
import { useVehiclesStore } from "@/modules/vehicles/stores/vehicles";
import { useCalloutStore } from "../../stores/callout";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";

interface VehicleWithIdAndCrewNumber extends Vehicle {
  id: string;
  crewNumber?: number;
}

export default {
  components: { CrewPage, VehicleCard },

  data() {
    return {
      showAllInactiveVehicles: false,
    };
  },

  computed: {
    ...mapState(useCalloutStore, ["callout", "crew"]),
    ...mapState(useVehiclesStore, {
      vehicles: "vehicles",
    }),

    crewCounts() {
      if (!this.crew || !this.crew.vehicles) {
        return {};
      }
      const crewCountsEntries = Object.entries(this.crew.vehicles).map(
        (entry) => [entry[0], Object.keys(entry[1]).length]
      );
      return Object.fromEntries(crewCountsEntries);
    },

    sortedVehicles() {
      const sortedList: {
        used: VehicleWithIdAndCrewNumber[];
        active: VehicleWithIdAndCrewNumber[];
        inactive: VehicleWithIdAndCrewNumber[];
      } = {
        used: [],
        active: [],
        inactive: [],
      };

      if (this.vehicles.length == 0) {
        return sortedList;
      }

      for (const vehicleIdx in this.vehicles) {
        const vehicle = this.vehicles[vehicleIdx];
        const isUsed =
          (this.crewCounts && this.crewCounts[vehicle.id]) ||
          (this.callout?.vehicles && this.callout.vehicles[vehicle.id]);

        if (isUsed) {
          sortedList.used.push({
            ...vehicle,
            id: vehicle.id,
            crewNumber: this.crewCounts[vehicle.id],
          });
        } else {
          if (!vehicle.outOfServiceSince) {
            sortedList.active.push(vehicle);
          } else {
            sortedList.inactive.push(vehicle);
          }
        }
      }

      return sortedList;
    },
  },

  methods: {
    selectVehicle(id: string) {
      this.$router.push({
        name: "CrewVehicleDetails",
        params: {
          callout_id: useCalloutStore().callout?.id,
          vehicle_id: id,
        },
      });
    },
  },
};
</script>
