<template>
  <div>
    <snackbar />

    <navigation-drawer v-if="navdrawer" v-model="drawer" />

    <v-app-bar app>
      <v-app-bar-nav-icon v-if="navdrawer" @click.stop="drawer = !drawer" />

      <v-btn icon v-if="backButton" @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-btn icon v-if="closeButton" @click="goBack">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>

      <v-spacer />

      <slot />

      <template v-if="extended" v-slot:extension>
        <slot name="extension" />
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import Snackbar from "./Snackbar";
import NavigationDrawer from "../navigation/NavigationDrawer";

export default {
  components: {
    Snackbar,
    NavigationDrawer,
  },

  props: {
    pageTitle: {
      type: String,
      default: process.env.VUE_APP_TITLE,
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
    extended: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    drawer: null,
  }),

  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>
