<template>
  <div>
    <v-overlay :model-value="visible">
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

<style scoped>
.v-overlay {
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
