<template>
  <v-list-item avatar>
    <template v-if="icon" #prepend>
      <v-avatar>
        <v-icon>{{ icon }}</v-icon>
      </v-avatar>
    </template>

    <v-list-item-title>
      <slot></slot>
    </v-list-item-title>
    <v-list-item-subtitle v-if="subtitle">
      {{ subtitle }}
    </v-list-item-subtitle>
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
