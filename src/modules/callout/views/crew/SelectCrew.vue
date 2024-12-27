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
import CrewPage from "../../components/CrewPage.vue";
import CrewRolesForm from "../../components/form/CrewRolesForm.vue";
import PersonAutocomplete from "../../components/form/PersonAutocomplete.vue";
import { Person } from "@/modules/people/models/Person";
import { CalloutRole } from "../../models/Callout";
import { mapActions, mapState } from "pinia";
import { useCalloutStore } from "../../stores/callout";

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
    ...mapState(useCalloutStore, ["vehicle"]),

    crew() {
      const calloutStore = useCalloutStore();
      const crew =
        (this.vehicle &&
          calloutStore.crew?.vehicles &&
          calloutStore.crew.vehicles[this.vehicle.id]) ||
        {};
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
    ...mapActions(useCalloutStore, [
      "addCrewMember",
      "updateRole",
      "removeCrewMember",
    ]),

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
      this.addCrewMember(person.id).finally(() => {
        this.adding = false;
      });
    },

    onUpdate({ person, role }: { person: string; role?: CalloutRole }) {
      this.savingMap[person] = true;
      this.updateRole(person, role ? role : true).then(() => {
        delete this.savingMap[person];
      });
    },

    onRemove(personId: string) {
      this.savingMap[personId] = true;
      this.removeCrewMember(personId).then(() => {
        delete this.savingMap[personId];
      });
    },
  },
};
</script>
