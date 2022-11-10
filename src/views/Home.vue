<template>
  <BasePage navdrawer />
</template>

<script>
import modules from "@/modules";
import { mapState } from "vuex";

export default {
  computed: mapState("auth", ["loggedIn"]),

  watch: {
    loggedIn() {
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
