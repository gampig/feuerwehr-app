<template>
  <BasePage navdrawer />
</template>

<script>
import modules from "@/modules";
import { mapState } from "vuex";

export default {
  computed: mapState("auth", ["userSettings"]),

  watch: {
    userSettings() {
      this.redirect();
    },
  },

  created() {
    this.redirect();
  },

  methods: {
    redirect() {
      const startPage = modules.getStartPage();

      if (startPage) {
        this.$router.replace(startPage);
      }
    },
  },
};
</script>
