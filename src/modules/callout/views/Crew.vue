<template>
  <div>
    <router-view :loading="loading" />

    <ErrorDialog v-model="showErrorDialog" @retry="fetchData">
      <p>Die Einsatzdaten konnten nicht geladen werden.</p>
      <p>Fehlermeldung: {{ errorMessage }}</p>
    </ErrorDialog>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import ErrorDialog from "@/components/dialogs/ErrorDialog.vue";
import { useCalloutStore } from "../stores/callout";

export default defineComponent({
  components: { ErrorDialog },

  data() {
    return {
      showErrorDialog: false,
      errorMessage: "",
    };
  },

  computed: {
    ...mapState(useAuthStore, { vehicleId: "vehicle" }),
    ...mapState(useCalloutStore, ["loading", "callout", "vehicle"]),
  },

  watch: {
    $route: "fetchData",
  },

  created() {
    this.fetchData();
  },

  methods: {
    ...mapActions(useCalloutStore, ["selectCallout", "selectVehicle"]),

    handleError(error: Error | string) {
      if (typeof error === "string") {
        this.errorMessage = error;
      } else {
        this.errorMessage = error.name;
      }

      this.showErrorDialog = true;
    },

    fetchData() {
      this.showErrorDialog = false;

      const paramCalloutId = this.$route.params.callout_id;
      if (paramCalloutId) {
        if (!(this.callout && this.callout.id == paramCalloutId)) {
          this.selectCallout(paramCalloutId as string);
        }
      } else {
        this.selectCallout();
      }

      const paramVehicleId = this.vehicleId || this.$route.params.vehicle_id;
      if (paramVehicleId) {
        if (!(this.vehicle && this.vehicle.id == paramVehicleId)) {
          this.selectVehicle(paramVehicleId as string);
        }
      } else {
        this.selectVehicle();
      }
    },
  },
});
</script>
