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
          :value="vehicle"
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
        <VehicleCard :value="vehicle" @click="selectVehicle(vehicle.id)">
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
          <v-icon right>{{
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
          <VehicleCard :value="vehicle" @click="selectVehicle(vehicle.id)">
          </VehicleCard>
        </v-col>
      </v-row>
    </v-expand-transition>
  </CrewPage>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CrewPage from "../../components/CrewPage";
import VehicleCard from "../../components/cards/VehicleCard";

export default {
  components: { CrewPage, VehicleCard },

  data() {
    return {
      showAllInactiveVehicles: false,
    };
  },

  computed: {
    ...mapGetters("callout", ["crewCounts"]),
    ...mapState("vehicles", {
      vehicles: "vehicles",
      loadingVehicles: "loading",
    }),

    sortedVehicles() {
      const sortedList = {
        used: [],
        active: [],
        inactive: [],
      };

      if (!this.vehicles || this.vehicles.length == 0) {
        return sortedList;
      }

      const calloutHasVehicles = this.callout && this.callout.vehicles;

      for (const vehicleIdx in this.vehicles) {
        const vehicle = this.vehicles[vehicleIdx];
        const isUsed =
          (this.crewCounts && this.crewCounts[vehicle.id]) ||
          (calloutHasVehicles && this.callout.vehicles[vehicle.id]);

        if (isUsed) {
          sortedList.used.push({
            ...vehicle,
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
    selectVehicle(id) {
      this.$router.push({
        name: "CrewVehicleDetails",
        params: {
          callout_id: this.$store.state.callout.callout.id,
          vehicle_id: id,
        },
      });
    },
  },
};
</script>
