<template>
  <BasePage :page-title="training.title" extended back-button>
    <template #extension>
      <v-tabs v-model="currentTab" fixed-tabs>
        <v-tab>Details</v-tab>
        <v-tab>Teilnehmer</v-tab>
      </v-tabs>
    </template>

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

      <v-tabs-window v-model="currentTab" touchless>
        <v-tabs-window-item>
          <VForm :disabled="!editAllowed">
            <v-card border>
              <v-card-text>
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
              </v-card-text>
              <v-card-actions v-if="editAllowed || deleteAllowed">
                <v-btn
                  v-if="deleteAllowed"
                  variant="flat"
                  @click="showConfirmRemoveTrainingDialog"
                >
                  <v-icon start>mdi-delete</v-icon>Löschen
                </v-btn>
                <v-spacer />
                <v-btn v-if="editAllowed" variant="elevated" color="primary"
                  >Speichern</v-btn
                >
              </v-card-actions>
            </v-card>
          </VForm>
        </v-tabs-window-item>

        <v-tabs-window-item>
          <v-card border>
            <VForm v-if="editAllowed" ref="addParticipantForm">
              <v-card flat>
                <v-card-title>
                  <v-icon start>mdi-plus</v-icon>
                  Teilnehmer hinzufügen
                </v-card-title>
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
                    v-if="training.groups?.length > 0"
                    v-model="newParticipantGroup"
                    inline
                    :rules="[
                      (value) => !!value || 'Bitte eine Gruppe auswählen',
                    ]"
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
              <v-data-table
                v-model:sort-by="sortBy"
                :headers="headers"
                :items="training.participants"
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
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
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
import { capitalizeFirstLetter } from "@/utils/strings";
import { computed, reactive, ref } from "vue";
import { Participant, Training } from "../models/Training";
import { trainings, groups } from "./TestData";
import { formatDateTime } from "@/utils/dates";
import { VForm } from "vuetify/components/VForm";
import { SortItem } from "@/models/SortItem";
import { isValidName, required } from "@/utils/rules";
import { useRoute, useRouter } from "vue-router";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";
import moment from "moment";

const currentTab = ref(0);
const newParticipantName = ref("");
const newParticipantGroup = ref<string | undefined>(undefined);
const participantToDelete = ref<Participant>();
const startTimeDialog = ref(false);
const endTimeDialog = ref(false);
const confirmRemoveTrainingDialog = ref(false);
const confirmRemoveParticipantDialog = ref(false);

const route = useRoute();
const router = useRouter();

const { hasAnyRole } = useAuthStore();

const peopleStore = usePeopleStore();

const availablePeople = computed(() =>
  peopleStore.people
    .filter((person) => person.status !== "Ausgetreten")
    .map((person) => person.id)
);

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

const training = reactive<Training>(
  trainings.find((training) => training.id == route.params.id) || {
    id: "",
    title: "",
    creationTime: moment().unix(),
    groups: [],
    participants: [],
  }
);

const responsiblePeople = ref<string[]>();

const selectableGroups = training.groups
  .concat(groups)
  .filter((value, index, self) => self.indexOf(value) === index);

const editAllowed = computed((): boolean => {
  if (hasAnyRole(Acl.uebungImmerBearbeiten)) {
    return true;
  }
  if (!training.startTime) {
    return true;
  }
  const creationTime = moment.unix(training.creationTime);
  const startTime = moment.unix(training.startTime);
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
  return editAllowed.value && training.participants.length == 0;
});

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
    if (training.groups.length == 1) {
      newParticipantGroup.value = training.groups[0];
    }
  }
}

function showConfirmRemoveParticipantDialog(participant: Participant) {
  participantToDelete.value = participant;
  confirmRemoveParticipantDialog.value = true;
}

function removeParticipant() {
  if (participantToDelete.value !== undefined) {
    const index = training.participants.indexOf(participantToDelete.value);
    if (index > -1) {
      training.participants.splice(index, 1);
    }
    participantToDelete.value = undefined;
  }
  confirmRemoveParticipantDialog.value = false;
}

function updateStartTime(newTime: number) {
  training.startTime = newTime;
}

function updateEndTime(newTime: number) {
  training.endTime = newTime;
}

function isNotSelected(person: string) {
  return (
    !training.participants
      .map((p) => p.name.toLowerCase())
      .includes(person.toLowerCase()) || "Ist bereits eingetragen"
  );
}

function showConfirmRemoveTrainingDialog() {
  confirmRemoveTrainingDialog.value = true;
}

function removeTraining() {
  confirmRemoveTrainingDialog.value = false;
  const objectToRemove = trainings.find((item) => item.id == training.id);
  if (objectToRemove) {
    const index = trainings.indexOf(objectToRemove);
    if (index > -1) {
      trainings.splice(index, 1);
      router.replace({ name: "TrainingHome" });
    }
  }
}

function onGroupsUpdated(newGroups: string[]) {
  if (newGroups.length == 1) {
    newParticipantGroup.value = newGroups[0];
  } else {
    newParticipantGroup.value = undefined;
  }
}
</script>
