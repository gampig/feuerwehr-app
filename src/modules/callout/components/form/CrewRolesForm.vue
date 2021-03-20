<template>
  <v-row>
    <v-col
      v-for="crewMember in crew"
      :key="crewMember.person"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <crew-member-card
        :person="crewMember.person"
        :role="crewMember.role"
        :loading="loading[crewMember.person]"
        :outlined="cardsOutlined"
        @input="submit(crewMember.person, $event)"
        @delete="remove(crewMember.person)"
      >
      </crew-member-card>
    </v-col>
  </v-row>
</template>

<script>
import isEqual from "lodash/isEqual";
import NotificationMixin from "@/mixins/NotificationMixin";
import crewMemberCard from "../cards/CrewMemberCard";

export default NotificationMixin.extend({
  components: { crewMemberCard },

  props: {
    crew: {
      type: Array,
      required: true,
    },
    loading: {
      type: Object,
    },
    cardsOutlined: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    submit(person, role) {
      if (
        !isEqual(role, this.crew.find((item) => item.person === person).role)
      ) {
        this.$emit("input", { person, role });
      }
    },
    remove(personId) {
      this.$emit("delete", personId);
    },
  },
});
</script>
