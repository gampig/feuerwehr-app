<template>
  <BasePage
    page-title="Mannschaft auswählen"
    close-button
    :close-handler="closeHandler"
  >
    <template v-if="item" #actions>
      <v-menu bottom left>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="showCalloutDetails = true">
            <v-list-item-title>Einsatz anzeigen</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <v-stepper :value="currentStep" vertical>
      <v-stepper-step step="1" :complete="currentStep > 1">
        Einsatz
        <template v-if="callout">
          : {{ callout.alarmTime | formatDateTime }} -
          {{ callout.keyword }}
        </template>
      </v-stepper-step>
      <v-stepper-content step="1">
        <SelectCalloutStep
          @input="goTo('CrewEditCallout', { callout_id: $event })"
        />
      </v-stepper-content>

      <v-stepper-step step="2" :complete="currentStep > 2"
        >Einsatz bearbeiten</v-stepper-step
      >
      <v-stepper-content step="2">
        <EditCalloutStep @input="nextFromEditCallout" @back="goBack" />
      </v-stepper-content>

      <v-stepper-step step="3" :complete="currentStep > 3">
        Fahrzeug
        <template v-if="vehicle">: {{ vehicle.name }}</template>
      </v-stepper-step>
      <v-stepper-content step="3">
        <SelectVehicleStep
          @input="
            goTo('CrewVehicleDetails', {
              callout_id: callout['.key'],
              vehicle_id: $event,
            })
          "
          @back="goBack"
        />
      </v-stepper-content>

      <v-stepper-step step="4" :complete="currentStep > 4">
        Einsatzende
      </v-stepper-step>
      <v-stepper-content step="4">
        <VehicleDetailsStep
          @input="
            goTo('CrewPeople', {
              callout_id: callout['.key'],
              vehicle_id: vehicle.id,
            })
          "
          @back="goBack"
        />
      </v-stepper-content>

      <v-stepper-step step="5" :complete="currentStep > 5"
        >Mannschaft</v-stepper-step
      >
      <v-stepper-content step="5">
        <SelectCrewStep @input="closeHandler" @back="goBack"
      /></v-stepper-content>
    </v-stepper>

    <CalloutDetailsDialog v-model="showCalloutDetails" :item="item" />
  </BasePage>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import SelectCalloutStep from "../components/steppers/SelectCalloutStep";
import EditCalloutStep from "../components/steppers/EditCalloutStep";
import SelectVehicleStep from "../components/steppers/SelectVehicleStep";
import VehicleDetailsStep from "../components/steppers/VehicleDetailsStep";
import SelectCrewStep from "../components/steppers/SelectCrewStep";
import CalloutDetailsDialog from "../components/CalloutDetailsDialog";

export default {
  components: {
    SelectCalloutStep,
    EditCalloutStep,
    SelectVehicleStep,
    VehicleDetailsStep,
    SelectCrewStep,
    CalloutDetailsDialog,
  },

  data() {
    return {
      userIsVehicle: false,
      showCalloutDetails: false,

      steps: [
        "CrewCallouts",
        "CrewEditCallout",
        "CrewVehicles",
        "CrewVehicleDetails",
        "CrewPeople",
      ],
    };
  },

  computed: {
    ...mapState("callout", ["callout", "crew"]),
    ...mapState("vehicles", ["vehicle"]),
    ...mapState("auth", ["userSettings"]),
    ...mapGetters("vehicles", { findVehicle: "find" }),

    currentStep() {
      return this.getStepNumber(this.$route.name);
    },

    item() {
      if (!this.callout) {
        return null;
      }

      let vehicles = {};

      if (this.crew && this.crew.vehicles) {
        for (const vehicleIdx in this.crew.vehicles) {
          vehicles[vehicleIdx] = {
            vehicle: this.findVehicle(vehicleIdx),
            crewMembers: this.crew.vehicles[vehicleIdx],
          };
        }
      }

      if (this.callout.vehicles) {
        for (const vehicleIdx in this.callout.vehicles) {
          if (!vehicles[vehicleIdx]) {
            vehicles[vehicleIdx] = {
              vehicle: this.findVehicle(vehicleIdx),
            };
          }

          vehicles[vehicleIdx].calloutDetails = this.callout.vehicles[
            vehicleIdx
          ];
        }
      }

      return {
        ...this.callout,
        standbyCrew: (this.crew && this.crew.standby) || null,
        vehicles: vehicles !== {} ? vehicles : null,
      };
    },
  },

  watch: {
    $route() {
      this.init();
    },

    userSettings() {
      this.handleUserSettings();
    },
  },

  created() {
    this.init();
  },

  methods: {
    ...mapActions("callout", { bindCallout: "bind", unbindCallout: "unbind" }),
    ...mapActions("vehicles", ["bindVehicle", "unbindVehicle"]),

    getStepNumber(stepName) {
      const stepIndex = this.steps.indexOf(stepName) + 1;
      return stepIndex > 0 ? stepIndex : 1;
    },

    init() {
      const params = this.$route.params;
      this.initCallout(params.callout_id);
      this.initVehicle(params.vehicle_id);
    },

    initCallout(id) {
      if (id) {
        if (!this.callout || id != this.callout[".key"]) {
          this.bindCallout(id);
        }
      } else {
        this.unbindCallout();
      }
    },

    initVehicle(id) {
      if (id && (!this.vehicle || id != this.vehicle.id)) {
        this.bindVehicle(id);
      } else {
        this.handleUserSettings();
      }
    },

    handleUserSettings() {
      if (this.userSettings && this.userSettings.vehicle) {
        this.userIsVehicle = true;

        if (!this.vehicle || this.vehicle.id != this.userSettings.vehicle) {
          this.bindVehicle(this.userSettings.vehicle);
        }
      } else {
        this.userIsVehicle = false;
      }
    },

    goTo(name, params) {
      this.$router.push({ name, params });
    },

    goBack() {
      this.$router.back();
    },

    nextFromEditCallout() {
      if (!this.userIsVehicle) {
        this.goTo("CrewVehicles", { callout_id: this.callout[".key"] });
      } else {
        this.goTo("CrewVehicleDetails", { callout_id: this.callout[".key"] });
      }
    },

    closeHandler() {
      this.unbindCallout();
      this.unbindVehicle();
      this.$router.go(-1 * this.currentStep);
    },
  },
};
</script>
