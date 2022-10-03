<template>
  <BasePage page-title="Mannschaft eintragen" navdrawer>
    <v-container>
      <CalloutList @input="next" />
    </v-container>
  </BasePage>
</template>

<script>
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CalloutList from "../../components/CalloutList";

export default {
  components: { CalloutList },
  mixins: [CalloutGroupMixin],
};
</script>
