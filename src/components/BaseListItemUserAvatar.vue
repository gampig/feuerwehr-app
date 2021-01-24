<template>
  <v-list-item-avatar>
    <v-img v-if="src" :src="src"></v-img>
    <v-icon v-else>mdi-account-circle</v-icon>
  </v-list-item-avatar>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: null,
    },
  },
};
</script>
