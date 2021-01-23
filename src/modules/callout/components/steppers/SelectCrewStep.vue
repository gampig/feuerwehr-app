<template>
  <v-card class="ma-1" :loading="loadingCallout">
    <v-card-title>
      {{ vehicle && vehicle.name }}
    </v-card-title>
    <v-card-subtitle v-if="vehicle">
      {{ crew.length }} / {{ vehicle.maxCrewNumber }} Besatzung
    </v-card-subtitle>

    <v-divider></v-divider>

    <v-card-text :loading="loadingCallout">
      <person-autocomplete
        @input="onAdd"
        :items="peopleWithoutCrew"
        :loading="loading"
      ></person-autocomplete>

      <crew-roles-form
        @input="onUpdate"
        @delete="onRemove"
        :crew="crew"
        :loading="loadingMap"
        cards-outlined
      />
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="back" color="primary" text> Zurück </v-btn>
      <v-spacer></v-spacer>
      <v-btn :to="{ name: 'CalloutHome' }" color="primary"> Fertig </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import CrewRolesForm from "../form/CrewRolesForm";
import PersonAutocomplete from "../form/PersonAutocomplete";

export default {
  components: { CrewRolesForm, PersonAutocomplete },

  data() {
    return {
      loading: false,
      loadingMap: {},
    };
  },

  computed: {
    ...mapState("callout", {
      callout: "callout",
      crew: "crew",
      loadingCallout: "loading",
    }),
    ...mapState("vehicles", ["vehicle"]),
    ...mapGetters("people", {
      findPerson: "find",
      peopleWithoutCrew: "peopleWithoutCrew",
    }),
    ...mapGetters("callout", ["crewOfVehicle"]),

    crew() {
      const crew = this.crewOfVehicle(this.vehicle && this.vehicle.id) || {};
      const crewEntries = Object.entries(crew);

      return crewEntries.map((entry) => {
        return {
          person: this.findPerson(entry[0]),
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

    onAdd(item) {
      this.loading = true;

      const personId = item.id;

      this.addCrewMember({
        vehicleId: this.vehicle.id,
        personId,
      }).finally(() => {
        this.loading = false;
      });
    },
    onUpdate({ person, role }) {
      this.$set(this.loadingMap, person.id, true);
      this.updateRole({
        vehicleId: this.vehicle.id,
        personId: person.id,
        role: role ? role : true,
      }).then(() => {
        this.$delete(this.loadingMap, person.id);
      });
    },
    onRemove(personId) {
      this.$set(this.loadingMap, personId, true);
      this.removeCrewMember({
        vehicleId: this.vehicle.id,
        personId,
      }).then(() => {
        this.$delete(this.loadingMap, personId);
      });
    },
    back() {
      this.$emit("back");
    },
  },
};
</script>
