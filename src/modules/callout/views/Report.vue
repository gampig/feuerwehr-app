<template>
  <v-main>
    <v-toolbar>
      <v-btn icon="mdi-close" @click="router.back()" />

      <v-toolbar-title>Einsatzbericht</v-toolbar-title>
    </v-toolbar>

    <ReportForm></ReportForm>
  </v-main>
</template>

<script lang="ts" setup>
import { watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCalloutStore } from "../stores/callout";
import ReportForm from "../components/form/ReportForm.vue";

const route = useRoute();
const router = useRouter();
const calloutStore = useCalloutStore();

watchEffect(() => {
  if (route.params.callout_id) {
    calloutStore.selectCallout(route.params.callout_id as string);
  }
});
</script>
