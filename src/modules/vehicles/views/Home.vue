<template>
  <BasePage page-title="Fahrzeuge" navdrawer>
    <v-container>
      <v-row class="mb-10">
        <v-col>
          <v-btn v-if="showMapButton" color="primary" @click="showMap">
            <v-icon start>mdi-map</v-icon>
            Karte
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="vehicle in vehicles"
          :key="vehicle.id"
          cols="6"
          sm="4"
          lg="3"
        >
          <VehicleCard :model-value="vehicle" show-details></VehicleCard>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import { useAppSettingsStore } from "@/modules/appSettings/stores/appSettings";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import { useVehiclesStore } from "../stores/vehicles";
import VehicleCard from "../components/VehicleCard.vue";

export default defineComponent({
  components: { VehicleCard },

  data() {
    return {
      headers: [
        { title: "", key: "pictureUrl", width: "1%" },
        {
          title: "Bezeichnung",
          key: "name",
        },
        {
          title: "Besatzung",
          key: "maxCrewNumber",
        },
        {
          title: "Indienststellung",
          key: "inServiceSince",
        },
        {
          title: "Außerdienststellung",
          key: "outOfServiceSince",
        },
      ],
    };
  },

  computed: {
    ...mapState(useAppSettingsStore, ["feuerwehrGeraete"]),
    ...mapState(useVehiclesStore, {
      vehicles: "vehicles",
      loading: "loading",
    }),

    showMapButton(): boolean {
      return (this.feuerwehrGeraete?.fahrzeugPositionenLink?.length ?? 0) > 0;
    },
  },

  methods: {
    showMap() {
      var link = this.feuerwehrGeraete?.fahrzeugPositionenLink;
      if (link) {
        window.open(link, "_blank");
      }
    },
  },
});
</script>
