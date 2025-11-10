<template>
  <BasePage page-title="Übungen" navdrawer>
    <v-container fluid>
      <v-alert type="warning" closable density="compact" class="mb-3">
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>

      <v-row v-if="hasAnyRole(Acl.uebungGruppenBearbeiten)" class="mb-3">
        <v-col>
          <v-btn color="primary" @click="showCreateDialog">
            <v-icon start>mdi-plus</v-icon>
            Neue Übung
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-btn prepend-icon="mdi-cog" @click="editGroupsDialog = true">
            Gruppen
          </v-btn>
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

    <BaseCreateDialog
      v-model="createTrainingDialog"
      title="Übung erstellen"
      :loading="false"
      @create="createTraining"
    >
      <VForm ref="createTrainingForm">
        <v-text-field
          v-model="newTrainingTitle"
          label="Titel"
          :rules="[required]"
        />
      </VForm>
    </BaseCreateDialog>

    <BaseEditDialog v-model="editGroupsDialog" title="Gruppen">
      <v-table>
        <tbody>
          <tr v-for="group in groups" :key="group">
            <td>{{ group }}</td>
            <td>
              <v-btn icon size="small" variant="tonal"
                ><v-icon>mdi-arrow-up</v-icon></v-btn
              >
              <v-btn icon size="small" variant="tonal"
                ><v-icon>mdi-arrow-down</v-icon></v-btn
              >
              <v-btn icon size="small" variant="tonal"
                ><v-icon>mdi-delete</v-icon></v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-table>
    </BaseEditDialog>
  </BasePage>
</template>

<script setup lang="ts">
import { formatDateTime } from "@/utils/dates";
import { trainings, groups } from "./TestData";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Acl } from "@/acl";
import { SortItem } from "@/models/SortItem";
import moment from "moment";
import { VForm } from "vuetify/components/VForm";
import { required } from "@/utils/rules";

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
const createTrainingForm = ref<VForm>();
const createTrainingDialog = ref(false);
const newTrainingTitle = ref<string>();
const editGroupsDialog = ref(false);

function showTraining(id: string) {
  router.push({ name: "TrainingShow", params: { id: id } });
}

function showCreateDialog() {
  newTrainingTitle.value = undefined;
  createTrainingDialog.value = true;
}

async function createTraining() {
  if (!createTrainingForm.value) {
    return;
  }

  if ((await createTrainingForm.value.validate()).valid) {
    const id = Math.floor(Math.random() * 10000).toString();
    const currentTime = moment();
    items.push({
      id: id,
      title: newTrainingTitle.value ?? "",
      creationTime: currentTime.unix(),
      startTime: currentTime.unix(),
      endTime: currentTime.add(2, "h").unix(),
      groups: [],
      participants: [],
    });

    createTrainingForm.value.reset();
    createTrainingDialog.value = false;

    showTraining(id);
  }
}
</script>
