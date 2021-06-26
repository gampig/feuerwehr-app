<template>
  <CrewPage page-title="Einsatz auswählen">
    <CalloutList @input="next" />
  </CrewPage>
</template>

<script>
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CrewPage from "../../components/CrewPage";
import CalloutList from "../../components/CalloutList";

export default {
  components: { CrewPage, CalloutList },
  mixins: [CalloutGroupMixin],
};
</script>
