<template>
  <v-stepper v-model="currentStep" vertical>
    <BaseStepperVerticalStep
      :index="1"
      :step="steps[0]"
      :model-value="currentStep"
    >
      <SelectCalloutStep @update:model-value="onCalloutSelect" />
    </BaseStepperVerticalStep>

    <BaseStepperVerticalStep
      :index="2"
      :step="steps[1]"
      :model-value="currentStep"
    >
      <SelectStandbyStep @back="$router.back()" />
    </BaseStepperVerticalStep>

    <CreateDialog v-model="showCreateDialog" @save="onDialogClose" />
  </v-stepper>
</template>

<script lang="ts">
import { mapActions, mapState } from "vuex";
import SelectCalloutStep from "../components/steppers/SelectCalloutStep.vue";
import SelectStandbyStep from "../components/steppers/SelectStandbyStep.vue";
import CreateDialog from "../components/CreateDialog.vue";
import { formatDateTime } from "@/utils/dates";

export default {
  components: {
    SelectCalloutStep,
    SelectStandbyStep,
    CreateDialog,
  },

  data() {
    return {
      showCreateDialog: false,
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),

    id(): string | null | undefined {
      return this.$route.params.id as string | null | undefined;
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

    currentStep(): number {
      return this.getStepNumber(this.$route.name);
    },
  },

  watch: {
    id(id: string) {
      this.init(id);
    },
  },

  created() {
    this.init(this.id);
  },

  methods: {
    ...mapActions("callout", { bindCallout: "bind", unbindCallout: "unbind" }),

    init(id?: string | null) {
      if (id) {
        this.bindCallout(id);
      } else {
        this.unbindCallout();
      }
    },

    onCalloutSelect(calloutId: string | null) {
      if (!calloutId) {
        this.showCreateDialog = true;
      } else {
        this.goTo("StandbyPeople", { id: calloutId });
      }
    },

    onDialogClose(calloutId: string) {
      this.goTo("StandbyPeople", { id: calloutId });
    },

    getStepNumber(stepName?: string | symbol | null): number {
      if (!stepName) return 1;
      const stepIndex =
        this.steps.findIndex((step) => step.name === stepName) + 1;
      return stepIndex > 0 ? stepIndex : 1;
    },

    goTo(name: string, params: any): void {
      this.$router.push({ name, params });
    },
  },
};
</script>
