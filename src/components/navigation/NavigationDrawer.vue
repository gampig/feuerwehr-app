<template>
  <v-navigation-drawer
    :model-value="value"
    @update:model-value="$emit('input', $event)"
  >
    <v-list nav density="compact">
      <v-list-item
        v-if="!loggedIn"
        :to="loginRoute"
        replace
        prepend-avatar="mdi-login"
      >
        <v-list-item-title> Anmelden </v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else
        prepend-avatar="mdi-account-circle"
        @click.stop="showUserSettings = !showUserSettings"
      >
        <v-list-item-title>
          {{ user.displayName }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
        </v-list-item-subtitle>

        <v-icon end>
          {{ showUserSettings ? "mdi-menu-up" : "mdi-menu-down" }}
        </v-icon>
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
      <v-list v-if="loggedIn != true || showUserSettings" density="compact">
        <v-list-item>
          <v-list-item-subtitle class="text-xs text--disabled">
            Version: {{ version }}<br />Entwickelt von Jonas Gampig
          </v-list-item-subtitle>
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
    value: {
      type: Boolean,
    },
  },

  data: function () {
    return {
      version,

      showUserSettings: false,

      loginRoute: {
        name: "UserLogin",
        params: { nextUrl: this.$route.fullPath },
      },

      userLinks: [] as NavLink[],
      links: [] as NavLink[],
    };
  },

  computed: {
    ...mapState(useAuthStore, ["loggedIn", "user", "hasAnyRole"]),
  },

  watch: {
    loggedIn() {
      this.generateLinks();
    },
  },

  created() {
    this.generateLinks();
  },

  methods: {
    ...mapActions(useAuthStore, ["logout"]),

    generateLinks(): void {
      if (!this.loggedIn) {
        this.showUserSettings = false;
      }

      this.userLinks = [
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
          to: { name: "UserLogin" },
          icon: "mdi-login",
          auth: this.hasAnyRole(deviceRoles),
        },
      ];

      this.links = [
        {
          title: "Mannschaft",
          to: { name: "CrewCallouts" },
          icon: "mdi-alarm-light",
          auth: this.hasAnyRole(Acl.mannschaftsbuch),
        },
        {
          title: "Bereitschaft",
          to: { name: "SelectStandby" },
          icon: "mdi-alarm-light",
          auth: this.hasAnyRole(Acl.bereitschaftsliste),
        },
        {
          title: "Einsätze",
          to: { name: "CalloutList" },
          icon: "mdi-alarm-light",
          auth: this.hasAnyRole(Acl.mannschaftsbuch),
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
  },
});
</script>
