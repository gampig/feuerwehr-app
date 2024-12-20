<template>
  <v-container>
    <CalloutList @update:model-value="next" />
  </v-container>
</template>

<script>
import CalloutList from "../../components/CalloutList.vue";

export default {
  components: { CalloutList },

  methods: {
    next(calloutId) {
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
