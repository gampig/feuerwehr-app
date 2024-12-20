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
import { mapState } from "pinia";
import { defineComponent } from "vue";
import ErrorDialog from "@/components/dialogs/ErrorDialog.vue";

export default defineComponent({
  components: { ErrorDialog },

  data() {
    return {
      loadingCallout: false,
      loadingVehicle: false,

      showErrorDialog: false,
      errorMessage: "",
    };
  },

  computed: {
    ...mapState(useAuthStore, ["vehicle"]),
    loading(): boolean {
      return this.loadingCallout || this.loadingVehicle;
    },
  },

  watch: {
    $route: "fetchData",
  },

  created() {
    this.fetchData();
  },

  methods: {
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
        const callout = this.$store.state.callout.callout;
        if (!(callout && callout.id == paramCalloutId)) {
          this.loadingCallout = true;
          this.$store
            .dispatch("callout/bind", paramCalloutId)
            .catch(this.handleError)
            .finally(() => {
              this.loadingCallout = false;
            });
        }
      } else {
        this.$store.dispatch("callout/unbind");
      }

      const paramVehicleId = this.vehicle || this.$route.params.vehicle_id;
      if (paramVehicleId) {
        const vehicle = this.$store.state.vehicles.vehicle;
        if (!(vehicle && vehicle.id == paramVehicleId)) {
          //return store.dispatch("callout/bindVehicle", paramVehicleId);
          this.loadingVehicle = true;
          this.$store
            .dispatch("vehicles/bindVehicle", paramVehicleId)
            .catch(this.handleError)
            .finally(() => {
              this.loadingVehicle = false;
            });
        }
      } else {
        //return store.dispatch("callout/unbindVehicle");
        this.$store.dispatch("vehicles/unbindVehicle");
      }
    },
  },
});
</script>
