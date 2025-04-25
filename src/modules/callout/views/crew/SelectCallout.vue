<template>
  <v-container>
    <h2>Mannschaftsbuch</h2>
    <CalloutList @update:model-value="next" />
  </v-container>
</template>

<script lang="ts">
import CalloutList from "../../components/CalloutList.vue";

export default {
  components: { CalloutList },

  methods: {
    next(calloutId: string) {
      this.$router.push({
        name: "CrewEditCallout",
        params: {
          callout_id: calloutId,
        },
      });
    },
  },
};
</script>
