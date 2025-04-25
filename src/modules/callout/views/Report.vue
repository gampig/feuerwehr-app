<template>
  <v-main>
    <v-toolbar>
      <v-btn icon="mdi-close" @click="onCloseClicked" />

      <v-toolbar-title>Einsatzbericht</v-toolbar-title>
    </v-toolbar>

    <v-stepper
      ref="stepper"
      :items="['Basisdaten', 'Details', 'Einsatzmittel']"
      hide-actions
    >
      <template #[`item.1`]>
        <v-card title="Einsatzbasisdaten" :loading="calloutStore.loading">
          <v-card-text>
            <ReportBaselineDataForm />
          </v-card-text>
        </v-card>
      </template>

      <template #[`item.2`]>
        <v-card title="Details">
          <v-card-text>
            <ReportDetailsForm></ReportDetailsForm>
          </v-card-text>
        </v-card>
      </template>

      <template #[`item.3`]>
        <v-card title="Einsatzmittel">
          <v-card-text>
            <ReportResourcesForm></ReportResourcesForm>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="tonal" disabled>Speichern</v-btn>
            <v-btn color="primary" variant="flat" disabled>
              Speichern & Versenden
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <v-stepper-actions
        @click:prev="onPrevClicked"
        @click:next="onNextClicked"
      ></v-stepper-actions>
    </v-stepper>
  </v-main>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCalloutStore } from "../stores/callout";
import ReportBaselineDataForm from "../components/form/ReportBaselineDataForm.vue";
import ReportDetailsForm from "../components/form/ReportDetailsForm.vue";
import ReportResourcesForm from "../components/form/ReportResourcesForm.vue";

const route = useRoute();
const router = useRouter();
const calloutStore = useCalloutStore();

const stepper = ref<{ next: () => void; prev: () => void }>();

function onCloseClicked() {
  router.back();
}

function onPrevClicked() {
  stepper.value?.prev();
}

function onNextClicked() {
  stepper.value?.next();
}

watchEffect(() => {
  if (route.params.callout_id) {
    calloutStore.selectCallout(route.params.callout_id as string);
  }
});
</script>
