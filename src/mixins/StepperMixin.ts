import { StepperStep } from "@/models/StepperStep";
import Vue from "vue";

export default Vue.extend({
  computed: {
    steps(): StepperStep[] {
      return [];
    },

    currentStep(): number {
      return this.getStepNumber(this.$route.name);
    },
  },

  methods: {
    getStepNumber(stepName?: string | null): number {
      if (!stepName) return 1;
      const stepIndex =
        this.steps.findIndex((step) => step.name === stepName) + 1;
      return stepIndex > 0 ? stepIndex : 1;
    },

    goTo(name: string, params: any): void {
      this.$router.push({ name, params });
    },
  },
});
