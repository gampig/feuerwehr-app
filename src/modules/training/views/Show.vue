<template>
  <BasePage :page-title="training.title" extended back-button>
    <template #extension>
      <v-tabs v-model="currentTab" fixed-tabs>
        <v-tab>Details</v-tab>
        <v-tab>Teilnehmer</v-tab>
      </v-tabs>
    </template>

    <v-container>
      <v-alert type="warning" closable density="compact" border="start">
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>
      <v-alert type="info" density="compact" border="start" border-color>
        Änderungen werden automatisch gespeichert.
      </v-alert>

      <v-tabs-window v-model="currentTab" touchless>
        <v-tabs-window-item>
          <VForm>
            <v-card border>
              <v-card-text>
                <v-text-field v-model="training.title" label="Titel" />
                <v-text-field
                  :model-value="formatDateTime(training.startTime)"
                  label="Start"
                  append-icon="mdi-calendar"
                  readonly
                  @click="showStartTimeDialog = true"
                />
                <v-text-field
                  :model-value="formatDateTime(training.endTime)"
                  label="Ende"
                  append-icon="mdi-calendar"
                  readonly
                  clearable
                  @click="showEndTimeDialog = true"
                  @click:clear="training.endTime = undefined"
                />

                <v-text-field
                  v-model="training.location"
                  label="Ort"
                  append-icon="mdi-map-marker"
                />

                <v-select
                  v-model="training.groups"
                  :items="availableGroups"
                  multiple
                  label="Gruppen"
                >
                </v-select>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn variant="flat" disabled>
                  <v-icon start>mdi-delete</v-icon>Löschen
                </v-btn>
              </v-card-actions>
            </v-card>
          </VForm>
        </v-tabs-window-item>

        <v-tabs-window-item>
          <v-card border>
            <VForm ref="addParticipantForm">
              <v-card flat>
                <v-card-title>
                  <v-icon start>mdi-plus</v-icon>
                  Teilnehmer hinzufügen
                </v-card-title>
                <v-card-text>
                  <v-combobox
                    v-model:search="newParticipantName"
                    :items="availablePeople"
                    clearable
                    label="Teilnehmer"
                    variant="filled"
                    :rules="[isNotEmpty, isValidName]"
                  >
                  </v-combobox>
                  <v-radio-group
                    v-if="training.groups?.length > 0"
                    v-model="newParticipantGroup"
                    inline
                    :rules="[isNotEmpty]"
                  >
                    <v-radio
                      v-for="group in training.groups"
                      :key="group"
                      :label="group"
                      :model-value="group"
                    >
                    </v-radio>
                  </v-radio-group>
                </v-card-text>
                <v-card-actions>
                  <v-btn variant="flat" color="primary" @click="addParticipant">
                    Hinzufügen
                  </v-btn>
                </v-card-actions>
              </v-card>
            </VForm>
            <v-divider />
            <v-card flat>
              <v-card-title>
                <v-icon start>mdi-check</v-icon>
                Eingetragene Teilnehmer
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Suche"
                  hide-details
                />
              </v-card-text>
              <v-data-table
                :headers="headers"
                :items="training.participants"
                :items-per-page="-1"
                no-data-text="Keine Teilnehmer vorhanden"
                sort-by="name"
                :search="search"
              >
                <template #[`item.actions`]="{ item }">
                  <v-btn icon @click="removeParticipant(item)"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-card>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-container>

    <BaseDateTimeDialog
      v-model="showStartTimeDialog"
      :date="training.startTime"
      @update:date="updateStartTime"
    />
    <BaseDateTimeDialog
      v-model="showEndTimeDialog"
      :date="training.endTime"
      @update:date="updateEndTime"
    />
  </BasePage>
</template>

<script setup lang="ts">
import { usePeopleStore } from "@/modules/people/stores/people";
import { capitalizeFirstLetter } from "@/utils/strings";
import { computed, reactive, ref } from "vue";
import { Participant, Training } from "../models/Training";
import { trainings } from "./TestData";
import { formatDateTime } from "@/utils/dates";
import { VForm } from "vuetify/components";

const currentTab = ref(0);
const search = ref<string | undefined>(undefined);
const newParticipantName = ref("");
const newParticipantGroup = ref<string | undefined>(undefined);
const showStartTimeDialog = ref(false);
const showEndTimeDialog = ref(false);

const availableGroups = [
  "Zug A",
  "Zug B",
  "Jugend",
  "Kinderfeuerwehr",
  "Gruppe 1",
  "Neue Aktive",
  "Atemschutz",
  "Maschinisten",
  "UG-ÖEL",
  "Notfallteam",
  "Bootsführer",
  "Gruppenführer",
  "Gerätewart",
  "Leistungsprüfung",
  "Anderes",
];

const peopleStore = usePeopleStore();

const availablePeople = computed(() =>
  peopleStore.people
    .filter((person) => person.status !== "Ausgetreten")
    .map((person) => person.id)
);

const headers = [
  {
    text: "Name",
    value: "name",
    groupable: false,
  },
  {
    text: "Gruppe",
    value: "group",
  },
  {
    text: "",
    value: "actions",
    sortable: false,
  },
];

const training = reactive<Training>(trainings[0]);

const addParticipantForm = ref<VForm>();

async function addParticipant() {
  if (!addParticipantForm.value) {
    return;
  }

  if ((await addParticipantForm.value.validate()).valid) {
    const nameParts = newParticipantName.value.split(" ");
    const formattedName = nameParts
      .map((namePart) => capitalizeFirstLetter(namePart))
      .join(" ");

    training.participants.push({
      name: formattedName,
      group: newParticipantGroup.value,
    });
    addParticipantForm.value.reset();
  }
}

function removeParticipant(participant: Participant) {
  const index = training.participants.indexOf(participant);
  if (index > -1) {
    training.participants.splice(index, 1);
  }
}

function updateStartTime(newTime: number) {
  training.startTime = newTime;
}

function updateEndTime(newTime: number) {
  training.endTime = newTime;
}

function isNotEmpty(value: any): boolean | string {
  return !!value || "Bitte fülle dieses Feld aus";
}

function isValidName(value?: string): boolean | string {
  const parts = value?.split(", ") ?? [];
  return parts.length === 2 || "Format: Nachname, Vorname";
}
</script>
