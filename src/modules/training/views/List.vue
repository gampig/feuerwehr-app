<template>
  <BasePage page-title="Übungen" navdrawer>
    <template #actions>
      <v-btn icon @click="createTraining"><v-icon>mdi-plus</v-icon></v-btn>
    </template>

    <v-container fluid>
      <v-alert type="warning" closable density="compact" class="mb-3">
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>

      <v-row v-if="hasAnyRole(Acl.uebungGruppenBearbeiten)" class="mb-3">
        <v-col class="d-flex justify-end align-center">
          <v-btn prepend-icon="mdi-cog" disabled> Gruppen </v-btn>
        </v-col>
      </v-row>

      <v-data-table
        :search="search"
        :headers="headers"
        :sort-by="sortBy"
        :items="items"
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

        <template #[`item.startTime`]="{ item }">
          {{ formatDateTime(item.startTime) }}
        </template>

        <template #[`item.groups`]="{ item }">
          {{ item.groups.join(", ") }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn variant="tonal" @click="showTraining(item.id)"> Öffnen </v-btn>
        </template>
      </v-data-table>
    </v-container>
  </BasePage>
</template>

<script setup lang="ts">
import { formatDateTime } from "@/utils/dates";
import { trainings } from "./TestData";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { SortItem } from "@/models/SortItem";
import moment from "moment";

const router = useRouter();

const { hasAnyRole } = useAuthStore();

const headers = [
  { title: "Datum", key: "startTime", nowrap: true },
  { title: "Gruppen", key: "groups", nowrap: true },
  { title: "Titel", key: "title" },
  { title: "", key: "actions", sortable: false },
];

const sortBy: SortItem[] = [
  {
    key: "startTime",
    order: "desc",
  },
];

const items = trainings;

const search = ref("");

function showTraining(id: string) {
  router.push({ name: "TrainingShow", params: { id: id } });
}

function createTraining() {
  const id = Math.floor(Math.random() * 10000).toString();
  const currentTime = moment();
  items.push({
    id: id,
    title: "",
    creationTime: currentTime.unix(),
    startTime: currentTime.unix(),
    endTime: currentTime.add(2, "h").unix(),
    groups: [],
    participants: [],
  });
  showTraining(id);
}
</script>
