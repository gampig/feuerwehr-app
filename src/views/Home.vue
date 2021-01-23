<template>
  <page navdrawer> </page>
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

  methods: {
    redirect() {
      const startPage = modules.getStartPage();

      if (startPage) {
        this.$router.replace(startPage);
      }
    },
  },

  created() {
    this.redirect();
  },
};
</script>
