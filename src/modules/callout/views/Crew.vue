<template>
  <page page-title="Mannschaft auswählen" close-button>
    <template v-if="item" v-slot:actions>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
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

    <v-stepper v-model="current_step" vertical>
      <v-stepper-step
        :step="steps.selectCallout"
        :complete="current_step > steps.selectCallout"
      >
        Einsatz
        <template v-if="callout">
          : {{ callout.alarmTime | formatDateTime }} -
          {{ callout.keyword }}
        </template>
      </v-stepper-step>
      <v-stepper-content :step="steps.selectCallout">
        <select-callout-step
          @input="goTo('CrewEditCallout', { callout_id: $event })"
        />
      </v-stepper-content>

      <v-stepper-step
        :step="steps.editCallout"
        :complete="current_step > steps.editCallout"
        >Einsatz bearbeiten</v-stepper-step
      >
      <v-stepper-content :step="steps.editCallout">
        <edit-callout-step
          @input="nextFromEditCallout"
          @back="goTo('CrewCallouts')"
        />
      </v-stepper-content>

      <v-stepper-step
        :step="steps.selectVehicle"
        :complete="current_step > steps.selectVehicle"
      >
        Fahrzeug
        <template v-if="vehicle">: {{ vehicle.name }}</template>
      </v-stepper-step>
      <v-stepper-content :step="steps.selectVehicle">
        <select-vehicle-step
          @input="
            goTo('CrewVehicleDetails', {
              callout_id: callout['.key'],
              vehicle_id: $event,
            })
          "
          @back="goTo('CrewEditCallout', { callout_id: callout['.key'] })"
        />
      </v-stepper-content>

      <v-stepper-step
        :step="steps.vehicleDetails"
        :complete="current_step > steps.vehicleDetails"
      >
        Einsatzende
      </v-stepper-step>
      <v-stepper-content :step="steps.vehicleDetails">
        <VehicleDetailsStep
          @input="
            goTo('CrewPeople', {
              callout_id: callout['.key'],
              vehicle_id: vehicle.id,
            })
          "
          @back="backFromVehicleDetails"
        />
      </v-stepper-content>

      <v-stepper-step
        :step="steps.selectCrew"
        :complete="current_step > steps.selectCrew"
        >Mannschaft</v-stepper-step
      >
      <v-stepper-content :step="steps.selectCrew">
        <select-crew-step
          @back="
            goTo('CrewVehicleDetails', {
              callout_id: callout['.key'],
              vehicle_id: vehicle.id,
            })
          "
      /></v-stepper-content>
    </v-stepper>

    <CalloutDetailsDialog v-model="showCalloutDetails" :item="item" />
  </page>
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
      current_step: 1,
      userIsVehicle: false,
      showCalloutDetails: false,
      steps: {
        selectCallout: 1,
        editCallout: 2,
        selectVehicle: 3,
        vehicleDetails: 4,
        selectCrew: 5,
      },
    };
  },

  computed: {
    ...mapState("callout", ["callout", "crew"]),
    ...mapState("vehicles", ["vehicle"]),
    ...mapState("auth", ["userSettings"]),
    ...mapGetters("vehicles", { findVehicle: "find" }),

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

  methods: {
    ...mapActions("callout", { bindCallout: "bind", unbindCallout: "unbind" }),
    ...mapActions("vehicles", ["bindVehicle", "unbindVehicle"]),

    init() {
      const name = this.$route.name;
      const params = this.$route.params;

      this.initCallout(params.callout_id);
      this.initVehicle(params.vehicle_id);

      switch (name) {
        default:
          this.current_step = this.steps.selectCallout;
          break;

        case "CrewEditCallout":
          this.current_step = this.steps.editCallout;
          break;

        case "CrewVehicles":
          this.current_step = this.steps.selectVehicle;
          break;

        case "CrewVehicleDetails":
          this.current_step = this.steps.vehicleDetails;
          break;

        case "CrewPeople":
          this.current_step = this.steps.selectCrew;
          break;
      }
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
    nextFromEditCallout() {
      if (!this.userIsVehicle) {
        this.goTo("CrewVehicles", { callout_id: this.callout[".key"] });
      } else {
        this.goTo("CrewVehicleDetails", { callout_id: this.callout[".key"] });
      }
    },
    backFromVehicleDetails() {
      if (!this.userIsVehicle) {
        this.goTo("CrewVehicles", { callout_id: this.callout[".key"] });
      } else {
        this.goTo("CrewEditCallout", { callout_id: this.callout[".key"] });
      }
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
};
</script>
