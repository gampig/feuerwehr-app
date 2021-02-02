import Vue from "vue";
import { mapState, Store } from "vuex";

export default Vue.extend({
  data() {
    return {
      loadingCallout: true,
      loadingVehicle: true,
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout" }),
  },

  created() {
    function fetchCallout(
      store: Store<any>,
      paramCalloutId?: string
    ): Promise<any> {
      if (paramCalloutId) {
        const callout = store.state.callout.callout;
        if (!(callout && callout.id == paramCalloutId)) {
          return store.dispatch("callout/bind", paramCalloutId);
        } else {
          return Promise.resolve();
        }
      } else {
        return store.dispatch("callout/unbind");
      }
    }

    function fetchVehicle(
      store: Store<any>,
      paramVehicleId?: string
    ): Promise<any> {
      if (paramVehicleId) {
        const vehicle = store.state.callout.vehicle;
        if (!(vehicle && vehicle.id == paramVehicleId)) {
          //return store.dispatch("callout/bindVehicle", paramVehicleId);
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      } else {
        //return store.dispatch("callout/unbindVehicle");
        return Promise.reject();
      }
    }

    fetchCallout(this.$store, this.$route.params.callout_id).finally(() => {
      this.loadingCallout = false;
    });
    fetchVehicle(this.$store, this.$route.params.vehicle_id).finally(() => {
      this.loadingVehicle = false;
    });
  },
});
