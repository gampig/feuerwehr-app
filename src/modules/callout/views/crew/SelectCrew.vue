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

        <v-data-table
          :headers="headers"
          :items="crew"
          :loading="loading"
          :sort-by="['role']"
          :sort-desc="[true]"
          loading-text="Laden..."
          class="elevation-1"
          locale="de-DE"
          item-key="person"
          hide-default-footer
          disable-pagination
        >
          <template #[`item.action`]="{ item }">
            <v-edit-dialog
              :return-value.sync="item.role"
              cancel-text="Abbrechen"
              save-text="Speichern"
              large
              persistent
              @save="onUpdate(item)"
            >
              <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
              <template #input>
                <div class="mt-4 title">Funktion ändern</div>
                <v-select
                  v-model="item.role"
                  :items="roles"
                  label="Funktion"
                  clearable
                />
              </template>
            </v-edit-dialog>

            <v-btn icon @click="personToRemove = item.person">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

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
  </CrewPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { ALL_CALLOUT_ROLES } from "../../models/Callout";
import CalloutGroupMixin from "../../mixins/CalloutGroupMixin";
import CrewPage from "../../components/CrewPage";
import PersonAutocomplete from "../../components/form/PersonAutocomplete";

export default {
  components: { CrewPage, PersonAutocomplete },
  mixins: [CalloutGroupMixin],

  data() {
    return {
      roles: ALL_CALLOUT_ROLES,
      adding: false,
      savingMap: {},
      personToRemove: null,

      headers: [
        { text: "Person", value: "person" },
        { text: "Funktion", value: "role" },
        {
          text: "Aktionen",
          value: "action",
          sortable: false,
        },
      ],
    };
  },

  computed: {
    ...mapState("callout", {
      crew: "crew",
    }),

    ...mapGetters("people", {
      peopleWithoutCrew: "peopleWithoutCrew",
    }),

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

    cancelRemoval() {
      this.personToRemove = null;
    },

    confirmRemoval() {
      this.remove(this.personToRemove);
      this.personToRemove = null;
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

    remove(personId) {
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
