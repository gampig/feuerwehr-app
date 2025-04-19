<template>
  <BasePage page-title="Stammdaten" extended navdrawer>
    <template #extension>
      <v-tabs fixed-tabs>
        <v-tab
          v-if="hasAnyRole(Acl.personenBearbeiten)"
          :to="{ name: 'PeopleHome' }"
          replace
        >
          <v-icon start>mdi-account-multiple</v-icon>
          Personen
        </v-tab>
      </v-tabs>
    </template>

    <router-view></router-view>
  </BasePage>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";

const { hasAnyRole } = useAuthStore();
</script>
