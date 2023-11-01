<template>
  <v-container>
    <CalloutList @input="next" />
  </v-container>
</template>

<script>
import CalloutList from "../../components/CalloutList";

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
