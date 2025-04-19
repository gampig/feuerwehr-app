<template>
  <v-container>
    <v-row v-if="hasAnyRole(Acl.einsatzberichtVerteilerBearbeiten)">
      <v-col class="d-flex justify-end align-center">
        <v-btn prepend-icon="mdi-cog"> Verteiler </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <CalloutList :create-allowed="false" @update:model-value="select" />
      </v-col>
    </v-row>

    <ReportDialog v-if="reportDialog" v-model="reportDialog" />
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import CalloutList from "../components/CalloutList.vue";
import ReportDialog from "../components/ReportDialog.vue";
import { useCalloutStore } from "../stores/callout";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";

const reportDialog = ref(false);

const calloutStore = useCalloutStore();

const { hasAnyRole } = useAuthStore();

function select(calloutId: string) {
  reportDialog.value = true;
  calloutStore.selectCallout(calloutId);
}
</script>
