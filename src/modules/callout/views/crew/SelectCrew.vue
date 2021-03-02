<template>
  <CrewPage
    page-title="Mannschaft"
    save-button
    save-button-label="Fertig"
    @submit="next"
  >
    <v-card :loading="loadingCallout">
      <v-card-title>
        {{ vehicle && vehicle.name }}
      </v-card-title>
      <v-card-subtitle v-if="vehicle && crew">
        {{ crew.length }} / {{ vehicle.maxCrewNumber }} Besatzung
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <PersonAutocomplete
          :items="peopleWithoutCrew"
          :loading="adding"
          @input="onAdd"
        ></PersonAutocomplete>

        <CrewRolesForm
          :crew="crew"
          :loading="savingMap"
          cards-outlined
          @input="onUpdate"
          @delete="onRemove"
        />
      </v-card-text>
    </v-card>
  </CrewPage>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CrewPage from "../../components/CrewPage";
import CrewRolesForm from "../../components/form/CrewRolesForm";
import PersonAutocomplete from "../../components/form/PersonAutocomplete";

export default {
  components: { CrewPage, CrewRolesForm, PersonAutocomplete },
  mixins: [CalloutGroupMixin],

  data() {
    return {
      adding: false,
      savingMap: {},
    };
  },

  computed: {
    ...mapGetters("people", {
      findPerson: "find",
      peopleWithoutCrew: "peopleWithoutCrew",
    }),

    ...mapGetters("callout", ["crewOfVehicle"]),

    crew() {
      return this.crewOfVehicle(this.vehicle && this.vehicle.id) || {};
    },
  },

  methods: {
    ...mapActions("callout", {
      addCrewMember: "addCrewMember",
      updateRole: "updateRole",
      removeCrewMember: "removeCrewMember",
    }),

    onAdd(item) {
      this.adding = true;

      const personId = item.id;

      this.addCrewMember({
        vehicleId: this.vehicle.id,
        personId,
      }).finally(() => {
        this.adding = false;
      });
    },

    onUpdate({ person, role }) {
      this.$set(this.savingMap, person.id, true);
      this.updateRole({
        vehicleId: this.vehicle.id,
        personId: person.id,
        role: role ? role : true,
      }).then(() => {
        this.$delete(this.savingMap, person.id);
      });
    },

    onRemove(personId) {
      this.$set(this.savingMap, personId, true);
      this.removeCrewMember({
        vehicleId: this.vehicle.id,
        personId,
      }).then(() => {
        this.$delete(this.savingMap, personId);
      });
    },
  },
};
</script>
