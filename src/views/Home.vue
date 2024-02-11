<template>
  <BasePage navdrawer />
</template>

<script lang="ts">
import Vue from "vue";
import { Acl } from "../acl";
import { Location } from "vue-router";
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default Vue.extend({
  computed: {
    ...mapState(useAuthStore, ["loggedIn", "hasAnyRole"]),
  },

  watch: {
    loggedIn() {
      this.redirect();
    },
  },

  created() {
    this.redirect();
  },

  methods: {
    getStartPage(): string | Location | null {
      if (this.hasAnyRole(Acl.alarmPc)) {
        return { name: "SelectStandby" };
      }

      if (
        this.hasAnyRole([...Acl.mannschaftsbuch, ...Acl.bereitschaftsliste])
      ) {
        return { name: "CrewCallouts" };
      }

      if (this.hasAnyRole(Acl.kleiderverwaltung)) {
        return { name: "ClothesHome" };
      }

      return null;
    },

    redirect() {
      const startPage = this.getStartPage();

      if (startPage) {
        this.$router.replace(startPage);
      }
    },
  },
});
</script>
