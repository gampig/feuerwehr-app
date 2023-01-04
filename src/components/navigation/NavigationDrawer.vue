<template>
  <v-navigation-drawer :value="value" app @input="$emit('input', $event)">
    <v-list nav>
      <v-list-item v-if="!loggedIn" :to="loginRoute" replace>
        <v-list-item-avatar>
          <v-icon>mdi-login</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> Anmelden </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-else @click.stop="showUserSettings = !showUserSettings">
        <v-list-item-avatar>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ user.displayName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ user.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-icon right>
          {{ showUserSettings ? "mdi-menu-up" : "mdi-menu-down" }}
        </v-icon>
      </v-list-item>

      <v-divider class="mb-3" />

      <NavigationLinks v-if="showUserSettings" :links="userLinks" />
      <NavigationLinks v-else :links="links" />
    </v-list>

    <template #append>
      <v-list v-if="loggedIn != true || showUserSettings" dense>
        <v-list-item>
          <v-list-item-subtitle class="text-xs text--disabled">
            Version: {{ version }}<br />Entwickelt von Jonas Gampig
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import version from "@/utils/version";
import NavigationLinks from "./NavigationLinks";
import { Acl } from "@/acl";

const deviceRoles = ["ROLE_VEHICLE", "ROLE_ALARM_PC"];

export default {
  components: {
    NavigationLinks,
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

      userLinks: [
        {
          title: "Gerät einrichten",
          to: { name: "DeviceSetup" },
          icon: "mdi-tablet",
          auth: () => this.hasAnyRole(Acl.geraetEinrichten),
        },
        {
          title: "Passwort ändern",
          to: { name: "UserChangePassword" },
          icon: "mdi-key",
          auth: () => this.loggedIn && !this.hasAnyRole(deviceRoles),
        },
        {
          title: "Abmelden",
          click: () => this.logout(),
          icon: "mdi-logout",
          auth: () => this.loggedIn && !this.hasAnyRole(deviceRoles),
        },
        {
          title: "Anmelden",
          to: { name: "UserLogin" },
          icon: "mdi-login",
          auth: () => this.hasAnyRole(deviceRoles),
        },
      ],

      links: [
        {
          title: "Mannschaft",
          to: { name: "CrewCallouts" },
          icon: "mdi-alarm-light",
          auth: () => this.hasAnyRole(Acl.mannschaftsbuch),
        },
        {
          title: "Bereitschaft",
          to: { name: "SelectStandby" },
          icon: "mdi-alarm-light",
          auth: () => this.hasAnyRole(Acl.bereitschaftsliste),
        },
        {
          title: "Einsätze",
          to: { name: "CalloutList" },
          icon: "mdi-alarm-light",
          auth: () => this.hasAnyRole(Acl.mannschaftsbuch),
        },
        {
          title: "Karte",
          to: { name: "Map" },
          icon: "mdi-map",
          auth: () => this.hasAnyRole(Acl.karte),
        },
        {
          title: "Kleidung",
          to: { name: "ClothesHome" },
          icon: "mdi-tshirt-crew",
          auth: () => this.hasAnyRole(Acl.kleiderverwaltung),
        },
        {
          title: "Personen",
          to: { name: "PeopleHome" },
          icon: "mdi-account-multiple",
          auth: () => this.hasAnyRole(Acl.personenBearbeiten),
        },
        {
          title: "Datenexport",
          to: { name: "ExporterHome" },
          icon: "mdi-download",
          auth: () => this.hasAnyRole(Acl.datenexport),
        },
      ],
    };
  },

  computed: {
    ...mapState("auth", ["loggedIn", "user"]),
    ...mapGetters("auth", ["hasAnyRole"]),
  },

  watch: {
    loggedIn(loggedIn) {
      if (!loggedIn) {
        this.showUserSettings = false;
      }
    },
  },

  methods: {
    ...mapActions("auth", ["logout"]),
  },
};
</script>
