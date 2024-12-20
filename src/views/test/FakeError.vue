<template>
  <BasePage navdrawer> </BasePage>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    throw new Error("Test");
  },
});
</script>
