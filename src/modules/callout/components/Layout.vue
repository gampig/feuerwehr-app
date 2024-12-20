<template>
  <div class="full-height">
    <AppBar v-if="!hideAppBar" page-title="Einsatz" navdrawer>
      <slot name="actions"></slot>
      <template #extension>
        <slot name="extension"></slot>
      </template>
    </AppBar>

    <v-main class="full-height">
      <router-view />
    </v-main>
  </div>
</template>

<script>
import AppBar from "@/components/bars/AppBar.vue";

export default {
  components: { AppBar },

  computed: {
    hideAppBar() {
      return this.$route.matched.some((route) => route.meta?.hideAppBar);
    },
  },
};
</script>

<style scoped>
.full-height {
  height: 100%;
}
</style>
