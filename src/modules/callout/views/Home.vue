<template>
  <BasePage page-title="Einsätze" extended navdrawer>
    <template #extension>
      <v-tabs fixed-tabs>
        <v-tab
          v-if="hasAnyRole(Acl.mannschaftsbuch)"
          :to="{ name: 'CrewCallouts' }"
          replace
        >
          Mannschaft
        </v-tab>
        <v-tab
          v-if="hasAnyRole(Acl.bereitschaftsliste)"
          :to="{ name: 'SelectStandby' }"
          replace
        >
          Bereitschaft
        </v-tab>
        <v-tab
          v-if="hasAnyRole(Acl.mannschaftsbuch)"
          :to="{ name: 'CalloutList' }"
          replace
        >
          Einsatzliste
        </v-tab>
      </v-tabs>
    </template>

    <router-view></router-view>
  </BasePage>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { useRoute, useRouter } from "vue-router";
import { watchEffect } from "vue";

const route = useRoute();
const router = useRouter();
const { hasAnyRole } = useAuthStore();

watchEffect(() => {
  if (route.name === "CalloutHome") {
    if (hasAnyRole(Acl.mannschaftsbuch)) {
      router.replace({ name: "CrewCallouts" });
    } else if (hasAnyRole(Acl.bereitschaftsliste)) {
      router.replace({ name: "SelectStandby" });
    }
  }
});
</script>
