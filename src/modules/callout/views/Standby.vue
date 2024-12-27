<template>
  <v-container>
    <v-stepper
      v-model="currentStep"
      :items="steps"
      color="primary"
      hide-actions
    >
      <template #[`item.1`]>
        <CalloutList @update:model-value="selectCallout">
          <v-card-title> Einsatz auswählen </v-card-title>
        </CalloutList>
      </template>

      <template #[`item.2`]>
        <v-card>
          <v-card-title>
            Bereitschaft ({{
              crewCount == 1 ? "1 Person" : `${crewCount} Personen`
            }})
          </v-card-title>
          <v-card-subtitle v-if="callout">
            {{ callout.keyword }} -
            {{ formatDateTimeFromNow(callout.alarmTime) }}
            ({{ formatDateTime(callout.alarmTime) }})
          </v-card-subtitle>
          <v-card-text v-if="callout">
            <PersonAutocomplete
              :loading="loading"
              @update:model-value="onAdd"
            ></PersonAutocomplete>
            <v-data-table
              :headers="crewTableHeaders"
              :items="crewTableItems"
              items-per-page="-1"
              no-data-text="Keine Personen eingetragen"
              variant="outlined"
              hide-default-header
              hide-default-footer
            >
              <template #[`item.action`]="{ item }">
                <v-btn variant="plain" @click="onRemove(item.person)">
                  Entfernen
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-btn @click="back">Zurück</v-btn>
            <v-spacer />
            <v-btn
              variant="flat"
              color="primary"
              @click="showDoneNotice = true"
            >
              Fertig
            </v-btn>
          </v-card-actions>
          <BaseConfirmDialog
            v-model="showRemoveDialog"
            confirm-text="Entfernen"
            @confirm="onRemoveConfirmed"
          >
            Soll <strong>{{ personToRemove }}</strong> wirklich vom Einsatz
            entfernt werden?
          </BaseConfirmDialog>
          <v-dialog v-model="showDoneNotice" width="auto">
            <v-card>
              <v-card-title>
                Bitte dieses Programm (FeuerwehrApp) schließen.
              </v-card-title>
              <v-card-actions>
                <v-btn variant="plain" @click="showDoneNotice = false">
                  Abbrechen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </template>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapState } from "vuex";
import CalloutList from "../components/CalloutList.vue";
import PersonAutocomplete from "../components/form/PersonAutocomplete.vue";
import { formatDateTime, formatDateTimeFromNow } from "@/utils/dates";
import { Person } from "@/modules/people/models/Person";

export default {
  components: {
    CalloutList,
    PersonAutocomplete,
  },

  data() {
    return {
      currentStep: 1,
      loading: false,
      personToRemove: null as string | null,
      showRemoveDialog: false,
      showDoneNotice: false,

      steps: [
        {
          value: 1,
          title: "Einsatz",
        },
        {
          value: 2,
          title: "Bereitschaft",
        },
      ],

      crewTableHeaders: [
        {
          title: "Name",
          value: "person",
        },
        {
          value: "action",
          width: "1%",
          sortable: false,
        },
      ],
    };
  },

  computed: {
    ...mapState("callout", ["callout"]),
    ...mapGetters("callout", { crew: "standbyCrew" }),

    crewCount() {
      return this.crew ? Object.keys(this.crew).length : 0;
    },

    crewTableItems(): Array<{ person: string }> {
      return Object.keys(this.crew).map((person) => ({
        person: person,
      }));
    },
  },

  methods: {
    ...mapActions("callout", {
      bindCallout: "bind",
      unbindCallout: "unbind",
      addStandbyMember: "addStandbyMember",
      removeStandbyMember: "removeStandbyMember",
    }),

    selectCallout(calloutId: string) {
      this.bindCallout(calloutId);
      this.currentStep = 2;
    },

    back() {
      this.unbindCallout();
      this.currentStep = 1;
    },

    onAdd(person: Person) {
      this.loading = true;
      this.addStandbyMember(person.id).finally(() => {
        this.loading = false;
      });
    },

    onRemove(person: string) {
      this.personToRemove = person;
      this.showRemoveDialog = true;
    },

    onRemoveConfirmed() {
      if (this.personToRemove) {
        this.removeStandbyMember(this.personToRemove);
      } else {
        throw new Error(
          "Konnte Person nicht entfernen wegen einem internen Fehler (personToRemove darf nicht NULL sein)."
        );
      }
    },

    formatDateTime,
    formatDateTimeFromNow,
  },
};
</script>

<style scoped>
:deep(.v-stepper-window) {
  margin: 0px;
  margin-top: 10px;
}
</style>
