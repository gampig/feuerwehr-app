<template>
  <div class="full-height">
    <app-bar v-bind="$attrs" v-on="$listeners">
      <slot name="actions"></slot>
      <template #extension>
        <slot name="extension"></slot>
      </template>
    </app-bar>

    <v-main class="full-height">
      <slot />
    </v-main>
  </div>
</template>

<script>
import AppBar from "../bars/AppBar";

export default {
  components: { AppBar },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
