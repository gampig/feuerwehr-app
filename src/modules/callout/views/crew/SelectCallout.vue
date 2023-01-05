<template>
  <BasePage page-title="Mannschaft eintragen" navdrawer>
    <v-container>
      <CalloutList @input="next" />
    </v-container>
  </BasePage>
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
