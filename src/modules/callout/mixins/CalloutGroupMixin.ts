import { showError } from "@/utils/notifications";
import Vue from "vue";
import { mapState, Store } from "vuex";

const stepRouteNames = [
  "CrewCallouts",
  "CrewEditCallout",
  "CrewVehicles",
  "CrewVehicleDetails",
  "CrewPeople",
];

function makeStepParams(calloutId?: string, vehicleId?: string) {
  return {
    ...(calloutId && { callout_id: calloutId }),
    ...(vehicleId && { vehicle_id: vehicleId }),
  };
}

function getNextStepNumber(currentStepNumber: number, vehicleId?: string) {
  const vehicleStepNumber = stepRouteNames.findIndex(
    (step) => step === "CrewVehicles"
  );
  if (currentStepNumber + 1 === vehicleStepNumber && vehicleId) {
    return currentStepNumber + 2;
  } else {
    return currentStepNumber + 1;
  }
}

export default Vue.extend({
  data() {
    return {
      loadingCallout: true,
      loadingVehicle: true,
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout" }),
    ...mapState("vehicles", { vehicle: "vehicle" }),

    loading(): boolean {
      return this.loadingCallout || this.loadingVehicle;
    },

    vehicleId(): string | undefined {
      return (
        this.$store.state.auth.userSettings?.vehicle ||
        this.$route.params.vehicle_id
      );
    },
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
          return store.dispatch("vehicles/bindVehicle", paramVehicleId);
        } else {
          return Promise.resolve();
        }
      } else {
        //return store.dispatch("callout/unbindVehicle");
        return store.dispatch("vehicles/unbindVehicle");
      }
    }

    fetchCallout(this.$store, this.$route.params.callout_id).finally(() => {
      this.loadingCallout = false;
    });
    fetchVehicle(this.$store, this.$route.params.vehicle_id).finally(() => {
      this.loadingVehicle = false;
    });
  },

  methods: {
    next(calloutId?: string, vehicleId?: string): void {
      const currentStepNumber = this.getCurrentStepNumber();
      if (currentStepNumber === -1) {
        showError("Unzulässige Nummer des aktuellen Schrittes");
      } else if (currentStepNumber < stepRouteNames.length - 1) {
        const nextStepNumber = getNextStepNumber(
          currentStepNumber,
          this.vehicleId
        );

        this.$router.push({
          name: stepRouteNames[nextStepNumber],
          params: makeStepParams(calloutId, vehicleId),
        });
      } else {
        this.goHome();
      }
    },

    goHome(): void {
      this.$router.push({ name: "CalloutHome" });
    },

    getCurrentStepNumber(): number {
      return stepRouteNames.findIndex((step) => step === this.$route.name);
    },
  },
});
