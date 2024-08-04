<template>
  <CrewPage
    page-title="Mannschaft"
    save-button
    save-button-label="Fertig"
    @submit="submit"
  >
    <v-card :loading="loading">
      <v-card-title>
        {{ vehicle && vehicle.name }}
      </v-card-title>
      <v-card-subtitle v-if="vehicle && crew">
        {{ crew.length }} / {{ vehicle.maxCrewNumber }} Besatzung
      </v-card-subtitle>

      <v-divider></v-divider>

      <v-card-text>
        <PersonAutocomplete
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
import { mapState, mapActions, mapGetters } from "vuex";
import CrewPage from "../../components/CrewPage";
import CrewRolesForm from "../../components/form/CrewRolesForm";
import PersonAutocomplete from "../../components/form/PersonAutocomplete";

export default {
  components: { CrewPage, CrewRolesForm, PersonAutocomplete },

  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      adding: false,
      savingMap: {},
    };
  },

  computed: {
    ...mapState("callout", {
      crew: "crew",
    }),

    ...mapState("vehicles", ["vehicle"]),

    ...mapGetters("callout", ["crewOfVehicle"]),

    crew() {
      const crew = this.crewOfVehicle(this.vehicle && this.vehicle.id) || {};
      const crewEntries = Object.entries(crew);

      return crewEntries.map((entry) => {
        return {
          person: entry[0],
          role: (typeof entry[1] === "string" && entry[1]) || "",
        };
      });
    },
  },

  methods: {
    ...mapActions("callout", {
      addCrewMember: "addCrewMember",
      updateRole: "updateRole",
      removeCrewMember: "removeCrewMember",
    }),

    submit() {
      this.$router.push({
        name: "CrewCallouts",
      });
    },

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
      this.$set(this.savingMap, person, true);
      this.updateRole({
        vehicleId: this.vehicle.id,
        personId: person,
        role: role ? role : true,
      }).then(() => {
        this.$delete(this.savingMap, person);
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
