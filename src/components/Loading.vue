<template>
  <div class="text-center">
    <v-overlay :value="visible">
      <v-progress-circular indeterminate size="64" />
      <h2 v-if="text" class="mt-5">{{ text }}</h2>
    </v-overlay>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },

    text: {
      type: String,
      default: null,
    },
  },
};
</script>
