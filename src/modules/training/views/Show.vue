<template>
  <BasePage :page-title="item.title" extended back-button>
    <template #extension>
      <v-tabs v-model="currentTab" fixed-tabs>
        <v-tab>Details</v-tab>
        <v-tab>Teilnehmer</v-tab>
      </v-tabs>
    </template>

    <v-container>
      <v-alert color="warning" dismissible>
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>

      <v-tabs-items v-model="currentTab">
        <v-tab-item>
          <v-form>
            <v-card>
              <v-card-text>
                <v-text-field v-model="item.title" label="Titel" />
                <v-text-field
                  v-model="item.startTime"
                  label="Start"
                  append-icon="mdi-calendar"
                />
                <v-text-field
                  v-model="item.endTime"
                  label="Ende"
                  append-icon="mdi-calendar"
                />

                <v-text-field
                  v-model="item.location"
                  label="Ort"
                  append-icon="mdi-map-marker"
                />

                <v-select
                  v-model="item.groups"
                  :items="availableGroups"
                  multiple
                  label="Gruppen"
                >
                </v-select>
              </v-card-text>
            </v-card>
          </v-form>
        </v-tab-item>

        <v-tab-item>
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
              >
              </v-combobox>
              <v-radio-group v-model="newParticipantGroup" row>
                <v-radio
                  v-for="group in item.groups"
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
              :items="item.participants"
              :items-per-page="-1"
              no-data-text="Keine Teilnehmer vorhanden"
              sort-by="name"
              :search="search"
            >
              <template #[`item.actions`]>
                <v-btn icon><v-icon>mdi-delete</v-icon></v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </BasePage>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { Training } from "../models/Training";
import { trainings } from "./TestData";

const currentTab = ref(0);
const search = ref<string | undefined>(undefined);
const newParticipantName = ref("");
const newParticipantGroup = ref<string | undefined>(undefined);

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

const item = reactive<Training>(trainings[0]);

function addParticipant() {
  newParticipantName.value = "";
}
</script>
