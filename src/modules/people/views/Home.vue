<template>
  <BasePage page-title="Personen" navdrawer>
    <v-container>
      <v-row class="mb-3">
        <v-col>
          <v-btn color="primary" @click="create">
            <v-icon start>mdi-plus</v-icon>
            Person hinzufügen
          </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :search="search"
        :headers="headers"
        :sort-by="sortBy"
        :items="people"
        :loading="loading"
      >
        <template #top>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            placeholder="Suche"
          ></v-text-field>
        </template>

        <template #[`item.recentCalloutsCount`]="{ item }">
          {{ item.recentCalloutsCount || 0 }}
        </template>

        <template #[`item.recentTrainingsCount`]="{ item }">
          {{ item.recentTrainingsCount || 0 }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn variant="tonal" @click="edit(item.id)">Bearbeiten</v-btn>
        </template>
      </v-data-table>
    </v-container>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>

    <EditDialog
      v-model="showEditDialog"
      :person-id="personToBeEdited"
    ></EditDialog>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CreateDialog from "../components/CreateDialog.vue";
import EditDialog from "../components/EditDialog.vue";
import { usePeopleStore } from "../stores/people";
import { SortItem } from "@/models/SortItem";

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const personToBeEdited = ref("");
const search = ref("");

const headers = [
  { title: "Name", key: "id" },
  { title: "Status", key: "status" },
  { title: "Einsätze", key: "recentCalloutsCount" },
  { title: "Übungen", key: "recentTrainingsCount" },
  { title: "", key: "actions", sortable: false },
];

const sortBy: SortItem[] = [
  {
    key: "id",
    order: "asc",
  },
];

const peopleStore = usePeopleStore();

const loading = computed(() => peopleStore.loading);

const people = computed(() =>
  (peopleStore.people ?? [])
    // Needed to make the id field enumerable
    .map((person: any) => ({
      ...person,
      id: person.id,
    }))
);

function create() {
  showCreateDialog.value = true;
}

function edit(id: string) {
  personToBeEdited.value = id;
  showEditDialog.value = true;
}
</script>
