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

    <v-dialog :value="personToRemove !== null" persistent max-width="300">
      <v-card>
        <v-card-title></v-card-title>
        <v-card-text>
          Soll {{ personToRemove }} wirklich von der Mannschaft entfernt werden?
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="cancelRemoval()"> Abbrechen </v-btn>
          <v-spacer />
          <v-btn text color="primary" @click="confirmRemoval()">
            Entfernen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Vue from "vue";
import crewMemberCard from "../cards/CrewMemberCard";

export default Vue.extend({
  components: { crewMemberCard },

  props: {
    crew: {
      type: Array,
      required: true,
    },

    loading: {
      type: Object,
      default: () => {
        return {};
      },
    },

    cardsOutlined: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      personToRemove: null,
    };
  },

  methods: {
    submit(person, role) {
      if (role != this.crew.find((item) => item.person === person).role) {
        this.$emit("input", { person, role });
      }
    },

    remove(personId) {
      this.personToRemove = personId;
    },

    cancelRemoval() {
      this.personToRemove = null;
    },

    confirmRemoval() {
      this.$emit("delete", this.personToRemove);
      this.personToRemove = null;
    },
  },
});
</script>
