<template>
  <BasePage page-title="Übungen" navdrawer>
    <template #actions>
      <v-btn icon disabled><v-icon>mdi-plus</v-icon></v-btn>
    </template>

    <v-container fluid>
      <v-alert type="warning" closable density="compact" class="mb-3">
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>

      <v-data-table :search="search" :headers="headers" :items="items">
        <template #top>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            placeholder="Suche"
          ></v-text-field>
        </template>

        <template #[`item.startTime`]="{ item }">
          {{ formatDateTime(item.startTime) }}
        </template>

        <template #[`item.groups`]="{ item }">
          {{ item.groups.join(", ") }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn variant="tonal" @click="showTraining(item)"> Öffnen </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </BasePage>
</template>

<script setup lang="ts">
import { formatDateTime } from "@/utils/dates";
import { Training } from "../models/Training";
import { trainings } from "./TestData";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const headers = [
  { title: "Datum", key: "startTime", nowrap: true },
  { title: "Gruppen", key: "groups", nowrap: true },
  { title: "Titel", key: "title" },
  { title: "", key: "actions", sortable: false },
];

const items = trainings;

const search = ref("");

function showTraining(item: Training) {
  router.push({ name: "TrainingShow", params: { id: item.id } });
}
</script>
