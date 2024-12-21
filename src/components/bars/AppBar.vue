<template>
  <div>
    <Snackbar />

    <NavigationDrawer v-if="navdrawer" v-model="drawer" />

    <v-app-bar color="blue-grey-lighten-5">
      <v-app-bar-nav-icon v-if="navdrawer" @click.stop="drawer = !drawer" />

      <v-btn v-if="backButton" icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-btn v-if="closeButton" icon @click="closePage">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>

      <v-spacer />

      <slot />

      <template v-if="extended" #extension>
        <slot name="extension" />
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import Snackbar from "./Snackbar.vue";
import NavigationDrawer from "../navigation/NavigationDrawer.vue";

export default {
  components: {
    Snackbar,
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
