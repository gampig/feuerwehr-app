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
          @update:model-value="onAdd"
        ></PersonAutocomplete>

        <CrewRolesForm
          :crew="crew"
          :loading="savingMap"
          cards-outlined
          @update:model-value="onUpdate"
          @delete="onRemove"
        />
      </v-card-text>
    </v-card>
  </CrewPage>
</template>

<script lang="ts">
import { mapState, mapActions, mapGetters } from "vuex";
import CrewPage from "../../components/CrewPage.vue";
import CrewRolesForm from "../../components/form/CrewRolesForm.vue";
import PersonAutocomplete from "../../components/form/PersonAutocomplete.vue";
import { Person } from "@/modules/people/models/Person";
import { CalloutRole } from "../../models/Callout";

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
      savingMap: {} as { [key: string]: boolean | undefined },
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
          role: (typeof entry[1] === "string" && entry[1]) || undefined,
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

    onAdd(person?: Person) {
      if (!person) {
        return;
      }
      this.adding = true;
      this.addCrewMember({
        vehicleId: this.vehicle.id,
        personId: person.id,
      }).finally(() => {
        this.adding = false;
      });
    },

    onUpdate({ person, role }: { person: string; role?: CalloutRole }) {
      this.savingMap[person] = true;
      this.updateRole({
        vehicleId: this.vehicle.id,
        personId: person,
        role: role ? role : true,
      }).then(() => {
        delete this.savingMap[person];
      });
    },

    onRemove(personId: string) {
      this.savingMap[personId] = true;
      this.removeCrewMember({
        vehicleId: this.vehicle.id,
        personId,
      }).then(() => {
        delete this.savingMap[personId];
      });
    },
  },
};
</script>
