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
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import CalloutList from "../components/CalloutList.vue";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const { hasAnyRole } = useAuthStore();

function select(calloutId: string) {
  router.push({ name: "CalloutReport", params: { callout_id: calloutId } });
}
</script>
