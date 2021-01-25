<template>
  <BasePage page-title="Bereitschaft eintragen" navdrawer>
    <v-stepper v-model="currentStep" vertical>
      <BaseStepperVerticalStep :index="1" :step="steps[0]" :value="currentStep">
        <SelectCalloutStep @input="onCalloutSelect" />
      </BaseStepperVerticalStep>

      <BaseStepperVerticalStep :index="2" :step="steps[1]" :value="currentStep">
        <SelectStandbyStep @back="$router.back()" />
      </BaseStepperVerticalStep>
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
import { formatDateTime } from "@/utils/dates";

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
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),

    id() {
      return this.$route.params.id;
    },

    steps() {
      return [
        {
          name: "StandbyCallout",
          label:
            "Einsatz" +
            (this.callout
              ? `: ${formatDateTime(this.callout.alarmTime)} - ${
                  this.callout.keyword
                }`
              : ""),
        },
        {
          name: "StandbyPeople",
          label: "Bereitschaft",
        },
      ];
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
      } else {
        this.unbindCallout();
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
