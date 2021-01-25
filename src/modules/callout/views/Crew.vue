<template>
  <BasePage
    page-title="Mannschaft auswählen"
    close-button
    :close-handler="closeHandler"
  >
    <template v-if="callout" #actions>
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
      <BaseStepperVerticalStep :index="1" :step="steps[0]" :value="currentStep">
        <SelectCalloutStep
          @input="goTo('CrewEditCallout', { callout_id: $event })"
        />
      </BaseStepperVerticalStep>

      <BaseStepperVerticalStep :index="2" :step="steps[1]" :value="currentStep">
        <EditCalloutStep @input="nextFromEditCallout" @back="goBack" />
      </BaseStepperVerticalStep>

      <BaseStepperVerticalStep :index="3" :step="steps[2]" :value="currentStep">
        <SelectVehicleStep
          @input="
            goTo('CrewVehicleDetails', {
              callout_id: callout['.key'],
              vehicle_id: $event,
            })
          "
          @back="goBack"
        />
      </BaseStepperVerticalStep>

      <BaseStepperVerticalStep :index="4" :step="steps[3]" :value="currentStep">
        <VehicleDetailsStep
          @input="
            goTo('CrewPeople', {
              callout_id: callout['.key'],
              vehicle_id: vehicle.id,
            })
          "
          @back="goBack"
        />
      </BaseStepperVerticalStep>

      <BaseStepperVerticalStep :index="5" :step="steps[4]" :value="currentStep">
        <SelectCrewStep @input="closeHandler" @back="goBack"
      /></BaseStepperVerticalStep>
    </v-stepper>

    <CalloutDetailsDialog v-model="showCalloutDetails" />
  </BasePage>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import StepperMixin from "@/mixins/StepperMixin";
import SelectCalloutStep from "../components/steppers/SelectCalloutStep";
import EditCalloutStep from "../components/steppers/EditCalloutStep";
import SelectVehicleStep from "../components/steppers/SelectVehicleStep";
import VehicleDetailsStep from "../components/steppers/VehicleDetailsStep";
import SelectCrewStep from "../components/steppers/SelectCrewStep";
import CalloutDetailsDialog from "../components/CalloutDetailsDialog";
import { formatDateTime } from "@/utils/dates";

export default {
  components: {
    SelectCalloutStep,
    EditCalloutStep,
    SelectVehicleStep,
    VehicleDetailsStep,
    SelectCrewStep,
    CalloutDetailsDialog,
  },

  mixins: [StepperMixin],

  data() {
    return {
      userIsVehicle: false,
      showCalloutDetails: false,
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),
    ...mapState("vehicles", ["vehicle"]),
    ...mapState("auth", ["userSettings"]),
    ...mapGetters("vehicles", { findVehicle: "find" }),

    steps() {
      return [
        {
          name: "CrewCallouts",
          label:
            "Einsatz" +
            (this.callout
              ? `: ${formatDateTime(this.callout.alarmTime)} - ${
                  this.callout.keyword
                }`
              : ""),
        },
        {
          name: "CrewEditCallout",
          label: "Einsatz bearbeiten",
        },
        {
          name: "CrewVehicles",
          label: "Fahrzeug" + (this.vehicle ? `: ${this.vehicle.name}` : ""),
        },
        {
          name: "CrewVehicleDetails",
          label: "Einsatzende",
        },
        {
          name: "CrewPeople",
          label: "Mannschaft",
        },
      ];
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
      this.$router.go(-1 * this.currentStep);
      this.unbindVehicle();
      this.unbindCallout();
    },
  },
};
</script>
