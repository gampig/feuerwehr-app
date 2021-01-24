<template>
  <BasePage page-title="Bereitschaft eintragen" navdrawer>
    <v-stepper v-model="current_step" vertical>
      <v-stepper-step step="1" :complete="currentStep > 1">
        Einsatz
        <template v-if="callout">
          : {{ callout.alarmTime | formatDateTime }} -
          {{ callout.keyword }}
        </template>
      </v-stepper-step>
      <v-stepper-content step="1">
        <SelectCalloutStep @input="onCalloutSelect" />
      </v-stepper-content>

      <v-stepper-step step="2" :complete="currentStep > 2"
        >Bereitschaft</v-stepper-step
      >
      <v-stepper-content step="2">
        <SelectStandbyStep @back="$router.back()"
      /></v-stepper-content>
    </v-stepper>

    <CreateDialog v-model="showCreateDialog" @save="onDialogClose" />
  </BasePage>
</template>

<script>
import { mapActions, mapState } from "vuex";
import StepperMixin from "@/mixins/StepperMixin";
import SelectCalloutStep from "../components/steppers/SelectCalloutStep";
import SelectStandbyStep from "../components/steppers/SelectStandbyStep";
import CreateDialog from "../components/CreateDialog";

export default {
  components: {
    SelectCalloutStep,
    SelectStandbyStep,
    CreateDialog,
  },

  mixins: [StepperMixin],

  data() {
    return {
      showCreateDialog: false,

      steps: ["StandbyCallout", "StandbyPeople"],
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),

    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    id(id) {
      this.init(id);
    },
  },

  created() {
    this.init(this.id);
  },

  methods: {
    ...mapActions("callout", { bindCallout: "bind", unbindCallout: "unbind" }),

    init(id) {
      if (id) {
        this.bindCallout(id);
        this.current_step = 2;
      } else {
        this.unbindCallout();
        this.current_step = 1;
      }
    },

    onCalloutSelect(calloutId) {
      if (!calloutId) {
        this.showCreateDialog = true;
      } else {
        this.goTo("StandbyPeople", { id: calloutId });
      }
    },

    onDialogClose(calloutId) {
      this.goTo("StandbyPeople", { id: calloutId });
    },
  },
};
</script>
