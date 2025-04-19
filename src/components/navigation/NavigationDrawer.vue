<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <v-list nav density="compact">
      <v-list-item
        v-if="!loggedIn"
        :to="loginRoute"
        replace
        prepend-icon="mdi-login"
      >
        <v-list-item-title> Anmelden </v-list-item-title>
      </v-list-item>

      <v-list-item v-else @click.stop="userSettingsButton = !showUserSettings">
        <template #prepend>
          <v-avatar icon="mdi-account-circle" />
        </template>

        <v-list-item-title>
          {{ user?.displayName }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user?.email }}
        </v-list-item-subtitle>

        <template #append>
          <v-icon>
            {{ showUserSettings ? "mdi-menu-up" : "mdi-menu-down" }}
          </v-icon>
        </template>
      </v-list-item>

      <v-divider class="mb-3" />

      <template v-if="showUserSettings">
        <NavigationLink
          title="Gerät einrichten"
          :to="{ name: 'DeviceSetup' }"
          icon="mdi-tablet"
          :auth="hasAnyRole(Acl.geraetEinrichten)"
        />
        <NavigationLink
          title="Passwort ändern"
          :to="{ name: 'UserChangePassword' }"
          icon="mdi-key"
          :auth="(loggedIn && !hasAnyRole(deviceRoles)) ?? false"
        />
        <NavigationLink
          title="Abmelden"
          :click="() => logout()"
          icon="mdi-logout"
          :auth="(loggedIn && !hasAnyRole(deviceRoles)) ?? false"
        />
        <NavigationLink
          title="Anmelden"
          :to="loginRoute"
          icon="mdi-login"
          :auth="hasAnyRole(deviceRoles)"
        />
      </template>
      <template v-else>
        <NavigationLink
          title="Mannschaft"
          :to="{ name: 'CrewCallouts' }"
          icon="mdi-alarm-light"
          :auth="hasAnyRole(Acl.mannschaftsbuch)"
        />
        <NavigationLink
          title="Bereitschaft"
          :to="{ name: 'SelectStandby' }"
          icon="mdi-alarm-light"
          :auth="hasAnyRole(Acl.bereitschaftsliste)"
        />
        <NavigationLink
          title="Einsätze"
          :to="{ name: 'CalloutList' }"
          icon="mdi-alarm-light"
          :auth="hasAnyRole(Acl.mannschaftsbuch)"
        />
        <NavigationLink
          title="Übungen"
          :to="{ name: 'TrainingHome' }"
          icon="mdi-human-male-board-poll"
          :auth="hasAnyRole(Acl.uebungenAnzeigen)"
        />
        <NavigationLink
          title="Fahrzeuge"
          :to="{ name: 'VehiclesHome' }"
          icon="mdi-fire-truck"
          :auth="hasAnyRole(Acl.feuerwehrGeraete)"
        />
        <NavigationLink
          title="Kleidung"
          :to="{ name: 'ClothesHome' }"
          icon="mdi-tshirt-crew"
          :auth="hasAnyRole(Acl.kleiderverwaltung)"
        />
        <NavigationLink
          title="Stammdaten"
          :to="{ name: 'MasterDataHome' }"
          icon="mdi-cog"
          :auth="hasAnyRole(Acl.stammdatenBearbeiten)"
        />
        <NavigationLink
          title="Benutzer"
          :to="{ name: 'UserList' }"
          icon="mdi-account-multiple"
          :auth="hasAnyRole(Acl.benutzerVerwalten)"
        />
        <NavigationLink
          title="Datenexport"
          :to="{ name: 'ExporterHome' }"
          icon="mdi-download"
          :auth="hasAnyRole(Acl.datenexport)"
        />
      </template>
    </v-list>

    <template #append>
      <v-list v-if="loggedIn == true && showUserSettings" density="compact">
        <v-list-item>
          <v-list-item-title class="text-caption text-disabled">
            Version: {{ version }}<br />Entwickelt von Jonas Gampig
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import version from "@/utils/version";
import NavigationLink from "./NavigationLink.vue";
import { Acl } from "@/acl";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import type { AllRoles } from "@/models/User";

defineProps<{
  modelValue?: boolean;
}>();

defineEmits<{
  "update:model-value": [value: boolean];
}>();

const route = useRoute();
const userSettingsButton = ref(false);
const deviceRoles: AllRoles[] = ["ROLE_VEHICLE", "ROLE_ALARM_PC"];

const authStore = useAuthStore();
const { loggedIn, user } = storeToRefs(authStore);
const { logout, hasAnyRole } = authStore;

const showUserSettings = computed(
  () => !loggedIn.value || userSettingsButton.value
);

const loginRoute = computed(() => ({
  name: "UserLogin",
  query: { next: route.fullPath },
}));
</script>
