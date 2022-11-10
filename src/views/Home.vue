<template>
  <BasePage navdrawer />
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
/* eslint-disable no-unused-vars */
import { Acl } from "../acl";
import { Location } from "vue-router";
import { AllRoles, Roles } from "@/models/User";
/* eslint-enable */

export default Vue.extend({
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
    hasAnyRole(roles: AllRoles[]): boolean {
      return this.$store.getters["auth/hasAnyRole"](roles);
    },

    getStartPage(): string | Location {
      const roles: Roles | undefined = this.$store.state.auth.roles;
      if (roles?.ROLE_ALARM_PC == true) {
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

      return { name: "UserLogin" };
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
