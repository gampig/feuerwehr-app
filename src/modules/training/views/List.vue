<template>
  <BasePage page-title="Übungen" navdrawer>
    <template #actions>
      <v-btn icon><v-icon>mdi-plus</v-icon></v-btn>
    </template>

    <v-container fluid>
      <v-alert color="warning" dismissible>
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>

      <BaseSearchRow />

      <v-row>
        <v-col cols="12">
          <v-data-table :headers="headers" :items="items">
            <template #[`item.actions`]="{ item }">
              <v-btn depressed @click="showTraining(item)">Auswählen</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script setup lang="ts">
import router from "@/router";
import { Training } from "../models/Training";
import { trainings } from "./TestData";

const headers = [
  { text: "Start", value: "startTime" },
  { text: "Gruppen", value: "groups" },
  { text: "Titel", value: "title" },
  { text: "", value: "actions", sortable: false },
];

const items = trainings;

function showTraining(item: Training) {
  router.push({ name: "TrainingShow", params: { id: item.id } });
}
</script>
