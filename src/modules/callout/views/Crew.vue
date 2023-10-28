<template>
  <div>
    <router-view :loading="loading" />
  </div>
</template>

<script lang="ts">
import { useAuthStore } from "@/stores/auth";
import { mapState } from "pinia";
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      loadingCallout: false,
      loadingVehicle: false,
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
    fetchData() {
      const paramCalloutId = this.$route.params.callout_id;
      if (paramCalloutId) {
        const callout = this.$store.state.callout.callout;
        if (!(callout && callout.id == paramCalloutId)) {
          this.loadingCallout = true;
          this.$store.dispatch("callout/bind", paramCalloutId).finally(() => {
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
