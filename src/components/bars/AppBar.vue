<template>
  <div>
    <NavigationDrawer v-if="navdrawer" v-model="drawer" />

    <v-app-bar>
      <v-app-bar-nav-icon v-if="navdrawer" @click.stop="drawer = !drawer" />

      <v-btn v-if="backButton" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-btn v-if="closeButton" icon @click="closePage">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>

      <v-spacer />

      <v-tooltip
        v-if="!isConnectedDebounced"
        text="Keine Verbindung zum Server möglich"
        open-on-click
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-signal-off"
            color="error"
            style="margin-inline-end: 4px; padding: 24px"
          ></v-icon>
        </template>
      </v-tooltip>

      <slot />

      <template v-if="extended" #extension>
        <slot name="extension" />
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import NavigationDrawer from "../navigation/NavigationDrawer.vue";
import { mapState } from "pinia";
import { useNetworkStore } from "@/stores/network";

export default {
  components: {
    NavigationDrawer,
  },

  props: {
    pageTitle: {
      type: String,
      default: import.meta.env.VITE_TITLE,
    },

    navdrawer: {
      type: Boolean,
      default: false,
    },

    backButton: {
      type: Boolean,
      default: false,
    },

    closeButton: {
      type: Boolean,
      default: false,
    },

    closeHandler: {
      type: Function,
      default: null,
    },

    extended: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    drawer: null,
  }),

  computed: {
    ...mapState(useNetworkStore, ["isConnectedDebounced"]),
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    closePage() {
      if (this.closeHandler) {
        this.closeHandler();
      } else {
        this.goBack();
      }
    },
  },
};
</script>
