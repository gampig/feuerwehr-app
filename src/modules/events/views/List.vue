<template>
  <BasePage page-title="Vereinsevents" navdrawer>
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
      </v-data-table>
    </v-container>
  </BasePage>
</template>

<script setup lang="ts">
import { ref } from "vue";

const headers = [
  { title: "Datum", key: "startTime", nowrap: true },
  { title: "Event", key: "name", nowrap: true },
  { title: "Ort", key: "location", nowrap: true },
  { title: "", key: "actions", sortable: false },
];

const items = ref([]);

const search = ref("");
</script>
