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
          v-for="item in userLinks"
          :key="item.title"
          :item="item"
        />
      </template>
      <template v-else>
        <NavigationLink v-for="item in links" :key="item.title" :item="item" />
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

<script lang="ts">
import { defineComponent } from "vue";
import version from "@/utils/version";
import NavigationLink from "./NavigationLink.vue";
import { Acl } from "@/acl";
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { NavLink } from "@/models/NavLink";
import { AllRoles } from "@/models/User";

const deviceRoles: AllRoles[] = ["ROLE_VEHICLE", "ROLE_ALARM_PC"];

export default defineComponent({
  components: {
    NavigationLink,
  },

  props: {
    modelValue: {
      type: Boolean,
    },
  },

  emits: ["update:model-value"],

  data: function () {
    return {
      version,
      userSettingsButton: false,
    };
  },

  computed: {
    ...mapState(useAuthStore, ["loggedIn", "user"]),

    showUserSettings() {
      return !this.loggedIn || this.userSettingsButton;
    },

    loginRoute() {
      return {
        name: "UserLogin",
        query: { next: this.$route.fullPath },
      };
    },

    links(): NavLink[] {
      return [
        {
          title: "Einsätze",
          to: { name: "CalloutHome" },
          icon: "mdi-alarm-light",
          auth: this.hasAnyRole(
            Acl.mannschaftsbuch.concat(Acl.bereitschaftsliste)
          ),
        },
        {
          title: "Übungen",
          to: { name: "TrainingHome" },
          icon: "mdi-human-male-board-poll",
          auth: this.hasAnyRole(Acl.uebungenAnzeigen),
        },
        {
          title: "Fahrzeuge",
          to: { name: "VehiclesHome" },
          icon: "mdi-fire-truck",
          auth: this.hasAnyRole(Acl.feuerwehrGeraete),
        },
        {
          title: "Kleidung",
          to: { name: "ClothesHome" },
          icon: "mdi-tshirt-crew",
          auth: this.hasAnyRole(Acl.kleiderverwaltung),
        },
        {
          title: "Personen",
          to: { name: "PeopleHome" },
          icon: "mdi-account-multiple",
          auth: this.hasAnyRole(Acl.personenBearbeiten),
        },
        {
          title: "Benutzer",
          to: { name: "UserList" },
          icon: "mdi-account-multiple",
          auth: this.hasAnyRole(Acl.benutzerVerwalten),
        },
        {
          title: "Datenexport",
          to: { name: "ExporterHome" },
          icon: "mdi-download",
          auth: this.hasAnyRole(Acl.datenexport),
        },
      ];
    },

    userLinks(): NavLink[] {
      return [
        {
          title: "Gerät einrichten",
          to: { name: "DeviceSetup" },
          icon: "mdi-tablet",
          auth: this.hasAnyRole(Acl.geraetEinrichten),
        },
        {
          title: "Passwort ändern",
          to: { name: "UserChangePassword" },
          icon: "mdi-key",
          auth: (this.loggedIn && !this.hasAnyRole(deviceRoles)) ?? false,
        },
        {
          title: "Abmelden",
          click: () => this.logout(),
          icon: "mdi-logout",
          auth: (this.loggedIn && !this.hasAnyRole(deviceRoles)) ?? false,
        },
        {
          title: "Anmelden",
          to: this.loginRoute,
          icon: "mdi-login",
          auth: this.hasAnyRole(deviceRoles),
        },
      ];
    },
  },

  methods: {
    ...mapActions(useAuthStore, ["logout", "hasAnyRole"]),
  },
});
</script>
