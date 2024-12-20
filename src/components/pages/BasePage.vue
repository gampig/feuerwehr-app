<template>
  <div class="full-height">
    <AppBar v-bind="$attrs">
      <slot name="actions"></slot>
      <template #extension>
        <slot name="extension"></slot>
      </template>
    </AppBar>

    <v-main class="full-height">
      <slot />
    </v-main>
  </div>
</template>

<script>
import AppBar from "../bars/AppBar.vue";

export default {
  components: { AppBar },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
