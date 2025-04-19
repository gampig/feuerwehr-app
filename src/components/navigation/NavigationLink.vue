<template>
  <v-list-item
    v-if="props.auth"
    :to="props.to"
    :href="props.href"
    v-on="props.click !== undefined ? { click: props.click } : {}"
  >
    <template v-if="props.icon" #prepend>
      <v-avatar :icon="props.icon"></v-avatar>
    </template>

    <v-list-item-title>{{ props.title }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { NavLink } from "@/models/NavLink";

const props = defineProps<NavLink>();
</script>
