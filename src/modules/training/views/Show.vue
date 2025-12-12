<template>
  <BasePage :page-title="training.title" back-button>
    <v-container>
      <v-alert
        type="warning"
        closable
        density="compact"
        border="start"
        class="mb-3"
      >
        Hinweis: Dieser Bereich ist noch Work-in-Progress. Er dient nur der
        Demonstration!
      </v-alert>
      <v-alert
        v-if="false"
        type="info"
        density="compact"
        variant="outlined"
        class="mb-3"
      >
        Änderungen werden automatisch gespeichert.
      </v-alert>

      <v-stepper :items="steps" editable color="primary">
        <template #[`item.1`]>
          <VForm :disabled="!editAllowed">
            <v-text-field v-model="training.title" label="Titel" />
            <v-text-field
              :model-value="formatDateTime(training.startTime)"
              label="Start"
              append-inner-icon="mdi-calendar"
              readonly
              @click="startTimeDialog = true"
            />
            <v-text-field
              :model-value="formatDateTime(training.endTime)"
              label="Ende"
              append-inner-icon="mdi-calendar"
              readonly
              clearable
              @click="endTimeDialog = true"
              @click:clear="training.endTime = undefined"
            />

            <v-autocomplete
              v-model="responsiblePeople"
              :items="availablePeople"
              multiple
              clear-on-select
              chips
              closable-chips
              label="Verantwortliche(r)"
              variant="filled"
            >
            </v-autocomplete>

            <v-select
              v-model="training.groups"
              :items="selectableGroups"
              multiple
              label="Gruppen"
              @update:model-value="onGroupsUpdated"
            >
            </v-select>
            <v-btn
              v-if="deleteAllowed"
              variant="flat"
              @click="showConfirmRemoveTrainingDialog"
            >
              <v-icon start>mdi-delete</v-icon>Löschen
            </v-btn>
          </VForm>
        </template>

        <template #[`item.2`]>
          <VForm v-if="editAllowed" ref="addParticipantForm">
            <v-card flat>
              <v-card-text>
                <v-autocomplete
                  v-model:search="newParticipantName"
                  :items="availablePeople"
                  clearable
                  label="Teilnehmer"
                  variant="filled"
                  :rules="[required, isNotSelected]"
                >
                </v-autocomplete>
                <v-radio-group
                  v-if="(training.groups ?? []).length > 0"
                  v-model="newParticipantGroup"
                  inline
                  :rules="[(value) => !!value || 'Bitte eine Gruppe auswählen']"
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
                <v-btn
                  type="submit"
                  variant="flat"
                  color="primary"
                  @click="addParticipant"
                >
                  Hinzufügen
                </v-btn>
              </v-card-actions>
            </v-card>
          </VForm>
          <v-divider class="mt-3" />
          <v-card flat>
            <v-data-table
              v-model:sort-by="sortBy"
              :headers="headers"
              :items="participants"
              :items-per-page="-1"
              no-data-text="Keine Teilnehmer vorhanden"
            >
              <template #[`item.actions`]="{ item }">
                <v-btn
                  v-if="editAllowed"
                  variant="plain"
                  @click="showConfirmRemoveParticipantDialog(item)"
                >
                  Entfernen
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </template>
      </v-stepper>
    </v-container>

    <BaseDateTimeDialog
      v-model="startTimeDialog"
      :date="training.startTime"
      @update:date="updateStartTime"
    />
    <BaseDateTimeDialog
      v-model="endTimeDialog"
      :date="training.endTime"
      @update:date="updateEndTime"
    />
    <BaseConfirmDialog
      v-model="confirmRemoveParticipantDialog"
      title="Entfernen bestätigen"
      width="500"
      @confirm="removeParticipant"
    >
      Möchtest du {{ participantToDelete?.name }} wirklich entfernen?
    </BaseConfirmDialog>
    <BaseConfirmDialog
      v-model="confirmRemoveTrainingDialog"
      title="Löschen bestätigen"
      width="500"
      @confirm="removeTraining"
    >
      Möchtest du diese Übung wirklich löschen?
    </BaseConfirmDialog>
  </BasePage>
</template>

<script setup lang="ts">
import { usePeopleStore } from "@/modules/people/stores/people";
import { computed, ref } from "vue";
import { Participant } from "../models/Training";
import { groups } from "./TestData";
import { formatDateTime } from "@/utils/dates";
import { VForm } from "vuetify/components/VForm";
import { SortItem } from "@/models/SortItem";
import { required } from "@/utils/rules";
import { useRoute, useRouter } from "vue-router";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";
import moment from "moment";
import { useTrainingsStore } from "../stores/trainings";

const newParticipantName = ref("");
const newParticipantGroup = ref<string | undefined>(undefined);
const participantToDelete = ref<Participant & { readonly id: string }>();
const startTimeDialog = ref(false);
const endTimeDialog = ref(false);
const confirmRemoveTrainingDialog = ref(false);
const confirmRemoveParticipantDialog = ref(false);

const route = useRoute();
const router = useRouter();

const { hasAnyRole } = useAuthStore();

const peopleStore = usePeopleStore();
const trainingsStore = useTrainingsStore();

const availablePeople = computed(() =>
  peopleStore.people
    .filter(
      (person) => person.status !== "Ausgetreten" && person.status !== "Passiv"
    )
    .map((person) => person.id)
);

const steps = [
  {
    value: 1,
    title: "Details",
  },
  {
    value: 2,
    title: "Teilnehmer",
  },
];

const headers = [
  {
    title: "Name",
    key: "name",
    groupable: false,
  },
  {
    title: "Gruppe",
    key: "group",
  },
  {
    title: "",
    key: "actions",
    width: "1%",
    sortable: false,
  },
];

const sortBy = ref<SortItem[]>([
  {
    key: "name",
  },
]);

const training = computed(
  () =>
    trainingsStore.trainings.find(
      (training) => training.id == route.params.id
    ) || {
      id: "",
      title: "",
      creationTime: moment().unix(),
    }
);

const participants = computed(() =>
  Object.entries(training.value.participants ?? {}).map((value) => ({
    id: value[0],
    ...value[1],
  }))
);

const responsiblePeople = ref<string[]>();

const selectableGroups =
  training.value.groups
    ?.concat(groups)
    .filter((value, index, self) => self.indexOf(value) === index) ?? [];

const editAllowed = computed((): boolean => {
  if (hasAnyRole(Acl.uebungImmerBearbeiten)) {
    return true;
  }
  if (!training.value.startTime) {
    return true;
  }
  const creationTime = moment.unix(training.value.creationTime);
  const startTime = moment.unix(training.value.startTime);
  const currentTime = moment();
  return (
    currentTime < startTime.add(6, "h") ||
    currentTime < creationTime.add(6, "h")
  );
});

const deleteAllowed = computed((): boolean => {
  if (hasAnyRole(Acl.uebungImmerBearbeiten)) {
    return true;
  }
  return editAllowed.value && participants.value.length == 0;
});

const addParticipantForm = ref<VForm>();

async function addParticipant() {
  if (!addParticipantForm.value) {
    return;
  }

  if ((await addParticipantForm.value.validate()).valid) {
    trainingsStore.addParticipant(
      training.value.id,
      newParticipantName.value,
      newParticipantGroup.value
    );
    addParticipantForm.value.reset();
    if (training.value.groups?.length == 1) {
      newParticipantGroup.value = training.value.groups[0];
    }
  }
}

function showConfirmRemoveParticipantDialog(
  participant: Participant & { readonly id: string }
) {
  participantToDelete.value = participant;
  confirmRemoveParticipantDialog.value = true;
}

async function removeParticipant() {
  if (participantToDelete.value !== undefined) {
    await trainingsStore.removeParticipant(
      training.value.id,
      participantToDelete.value.id
    );
    participantToDelete.value = undefined;
  }
  confirmRemoveParticipantDialog.value = false;
}

function updateStartTime(newTime: number) {
  training.value.startTime = newTime;
}

function updateEndTime(newTime: number) {
  training.value.endTime = newTime;
}

function isNotSelected(person: string) {
  return (
    !participants.value.map((p) => p.name).includes(person) ||
    "Ist bereits eingetragen"
  );
}

function showConfirmRemoveTrainingDialog() {
  confirmRemoveTrainingDialog.value = true;
}

async function removeTraining() {
  confirmRemoveTrainingDialog.value = false;
  await trainingsStore.remove(training.value.id);
  router.replace({ name: "TrainingHome" });
}

function onGroupsUpdated(newGroups: string[]) {
  if (newGroups.length == 1) {
    newParticipantGroup.value = newGroups[0];
  } else {
    newParticipantGroup.value = undefined;
  }
}
</script>
