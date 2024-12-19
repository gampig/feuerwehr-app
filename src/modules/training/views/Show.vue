<template>
  <BasePage :page-title="training.title" extended back-button>
    <template #extension>
      <v-tabs v-model="currentTab" fixed-tabs>
        <v-tab>Details</v-tab>
        <v-tab>Teilnehmer</v-tab>
      </v-tabs>
    </template>

    <v-container>
      <v-alert type="warning" dismissible dense border="left">
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>
      <v-alert type="info" dense border="left" colored-border>
        Änderungen werden automatisch gespeichert.
      </v-alert>

      <v-tabs-items v-model="currentTab">
        <v-tab-item>
          <v-form>
            <v-card>
              <v-card-text>
                <v-text-field v-model="training.title" label="Titel" />
                <v-text-field
                  :value="training.startTime | formatDateTime"
                  label="Start"
                  append-icon="mdi-calendar"
                  readonly
                  @click="showStartTimeDialog = true"
                />
                <v-text-field
                  :value="training.endTime | formatDateTime"
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
                <v-btn depressed disabled>
                  <v-icon left>mdi-delete</v-icon>Löschen
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-tab-item>

        <v-tab-item>
          <v-form ref="addParticipantForm">
            <v-card flat>
              <v-card-title>
                <v-icon left>mdi-plus</v-icon>
                Teilnehmer hinzufügen
              </v-card-title>
              <v-card-text>
                <v-combobox
                  :search-input.sync="newParticipantName"
                  :items="availablePeople"
                  clearable
                  label="Teilnehmer"
                  filled
                  :rules="[isNotEmpty, isValidName]"
                >
                </v-combobox>
                <v-radio-group
                  v-if="training.groups?.length > 0"
                  v-model="newParticipantGroup"
                  row
                  :rules="[isNotEmpty]"
                >
                  <v-radio
                    v-for="group in training.groups"
                    :key="group"
                    :label="group"
                    :value="group"
                  >
                  </v-radio>
                </v-radio-group>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="addParticipant">Hinzufügen</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
          <v-divider />
          <v-card flat>
            <v-card-title>
              <v-icon left>mdi-check</v-icon>
              Eingetragene Teilnehmer
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Suche"
                single-line
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
        </v-tab-item>
      </v-tabs-items>
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
import { capitalizeFirstLetter } from "@/utils/strings";
import { reactive, ref } from "vue";
import { Participant, Training } from "../models/Training";
import { trainings } from "./TestData";

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

const availablePeople = ["Mustermann, Max"];

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

const addParticipantForm = ref<HTMLFormElement | null>(null);

function addParticipant() {
  if (addParticipantForm.value?.validate()) {
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
