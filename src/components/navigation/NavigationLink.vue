<template>
  <v-list-item
    v-if="item.auth"
    :to="item.to"
    :href="item.href"
    v-on="item.click !== undefined ? { click: item.click } : {}"
  >
    <v-list-item-avatar v-if="item.icon">
      <v-icon>{{ item.icon }}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { NavLink } from "@/models/NavLink";
import Vue, { PropType } from "vue";

export default Vue.extend({
  props: {
    item: {
      type: Object as PropType<NavLink>,
      required: true,
    },
  },
});
</script>
