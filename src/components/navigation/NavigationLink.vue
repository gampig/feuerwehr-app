<template>
  <v-list-item
    v-if="item.auth"
    :to="item.to"
    :href="item.href"
    v-on="item.click !== undefined ? { click: item.click } : {}"
  >
    <template v-if="item.icon" #prepend>
      <v-avatar>
        <v-icon>{{ item.icon }}</v-icon>
      </v-avatar>
    </template>

    <v-list-item-title>{{ item.title }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts">
import { NavLink } from "@/models/NavLink";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<NavLink>,
      required: true,
    },
  },
});
</script>
