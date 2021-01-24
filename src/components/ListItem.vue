<template>
  <v-list-item>
    <v-list-item-avatar v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        <slot></slot>
      </v-list-item-title>
      <v-list-item-subtitle v-if="subtitle">
        {{ subtitle }}
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: null,
    },

    subtitle: {
      type: String,
      default: null,
    },
  },
};
</script>
