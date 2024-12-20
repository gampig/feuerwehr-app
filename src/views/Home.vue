<template>
  <BasePage navdrawer />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Acl } from "../acl";
import {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
} from "vue-router";
import { mapState } from "pinia";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
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
    getStartPage():
      | string
      | RouteLocationAsPathGeneric
      | RouteLocationAsRelativeGeneric
      | null {
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
