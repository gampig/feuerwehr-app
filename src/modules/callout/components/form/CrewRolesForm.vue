<template>
  <v-row>
    <v-col
      v-for="(role, person) in crew"
      :key="person"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <crew-member-card
        :person="person"
        :role="role"
        :loading="loading[person]"
        :outlined="cardsOutlined"
        @input="submit(person, $event)"
        @delete="remove(person)"
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
      if (!isEqual(role, this.crew[person])) {
        this.$emit("input", { person, role });
      }
    },
    remove(personId) {
      this.$emit("delete", personId);
    },
  },
});
</script>
