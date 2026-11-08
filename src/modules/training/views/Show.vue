<template>
  <BasePage :page-title="training.title" back-button>
    <v-container>
      <v-alert type="info" density="compact" variant="outlined" class="mb-3">
        Änderungen werden automatisch gespeichert.
      </v-alert>

      <v-stepper :items="steps" editable color="primary">
        <template #[`item.1`]>
          <VForm :disabled="!editAllowed">
            <v-text-field
              v-model="training.title"
              label="Titel"
              @update:model-value="updateField('title', $event)"
            />
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
              @click:clear="updateEndTime(undefined)"
            />

            <v-autocomplete
              :model-value="training.responsiblePeople"
              :items="availablePeople"
              multiple
              clear-on-select
              chips
              closable-chips
              label="Verantwortliche(r)"
              variant="filled"
              @update:model-value="updateField('responsiblePeople', $event)"
            >
            </v-autocomplete>

            <v-select
              v-model="training.groups"
              :items="selectableGroups"
              multiple
              label="Beteiligte Gruppen"
              hint="Diese Gruppen stehen beim Eintragen neuer Teilnehmer zur Auswahl. Bestehende Zuordnungen bleiben unverändert."
              persistent-hint
              @update:model-value="updateGroups"
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
                  v-model="newParticipantName"
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
                  variant="elevated"
                  color="primary"
                  @click="addParticipant"
                >
                  Hinzufügen
                </v-btn>
              </v-card-actions>
            </v-card>
          </VForm>
          <v-divider class="mt-3" />
          <v-list class="mt-3 border rounded" density="compact">
            <template v-if="participantGroups.length > 0">
              <template v-for="group in participantGroups" :key="group.key">
                <v-list-item
                  :title="group.label"
                  :subtitle="`${group.participants.length} Teilnehmer`"
                  prepend-icon="mdi-account-group"
                >
                  <template #append>
                    <v-btn
                      v-if="
                        canBulkChangeParticipantGroups &&
                        group.participants.length > 0 &&
                        bulkMoveTargetGroupsFor(group).length > 0
                      "
                      size="small"
                      variant="tonal"
                      @click="openBulkMoveDialog(group)"
                    >
                      Anderer Gruppe zuordnen
                    </v-btn>
                  </template>
                </v-list-item>
                <v-list-item
                  v-for="participant in group.participants"
                  :key="participant.id"
                  :title="participant.name"
                  class="ps-8"
                  prepend-icon="mdi-account"
                >
                  <template #append>
                    <v-btn
                      v-if="editAllowed"
                      variant="plain"
                      @click="showConfirmRemoveParticipantDialog(participant)"
                    >
                      Entfernen
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </template>
            <v-list-item v-else title="Keine Teilnehmer vorhanden" />
          </v-list>
          <div class="d-flex justify-end mt-6">
            <v-btn variant="tonal" color="primary" @click="close"
              >Speichern & Schließen</v-btn
            >
          </div>
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
    <v-dialog
      v-model="bulkMoveDialog"
      max-width="500"
      :persistent="bulkMoveSaving"
    >
      <v-card>
        <v-card-title>Teilnehmer gesammelt zuordnen</v-card-title>
        <v-card-text>
          <p class="mb-4">
            {{ bulkMoveParticipantCount }} Teilnehmer aus
            {{ bulkMoveSourceGroupLabel }} einer anderen Gruppe zuordnen.
          </p>
          <v-select
            v-model="bulkMoveTargetGroup"
            :items="bulkMoveTargetGroups"
            label="Zielgruppe"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :disabled="bulkMoveSaving" @click="closeBulkMoveDialog">
            Abbrechen
          </v-btn>
          <v-btn
            color="primary"
            :loading="bulkMoveSaving"
            :disabled="!bulkMoveTargetGroup"
            @click="moveParticipantsToGroup"
          >
            Zuordnen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </BasePage>
</template>

<script setup lang="ts">
import { usePeopleStore } from "@/modules/people/stores/people";
import { computed, ref, watchEffect } from "vue";
import { Participant } from "../models/Training";
import { formatDateTime } from "@/utils/dates";
import { VForm } from "vuetify/components/VForm";
import { required } from "@/utils/rules";
import { useRoute, useRouter } from "vue-router";
import { Acl } from "@/acl";
import { useAuthStore } from "@/stores/auth";
import moment from "moment";
import { useTrainingsStore } from "../stores/trainings";
import { useTrainingGroupsStore } from "../stores/trainingGroups";
import { showMessage } from "@/utils/notifications";

type ParticipantGroup = {
  key: string;
  name: string | undefined;
  label: string;
  participants: (Participant & { readonly id: string })[];
};

const newParticipantName = ref<string | null>(null);
const newParticipantGroup = ref<string | undefined>(undefined);
const participantToDelete = ref<Participant & { readonly id: string }>();
const bulkMoveSourceGroup = ref<string | undefined>();
const bulkMoveTargetGroup = ref<string>();
const bulkMoveParticipantCount = ref(0);
const startTimeDialog = ref(false);
const endTimeDialog = ref(false);
const confirmRemoveTrainingDialog = ref(false);
const confirmRemoveParticipantDialog = ref(false);
const bulkMoveDialog = ref(false);
const bulkMoveSaving = ref(false);

const route = useRoute();
const router = useRouter();

const { hasAnyRole } = useAuthStore();

const peopleStore = usePeopleStore();
const trainingsStore = useTrainingsStore();
const trainingGroupsStore = useTrainingGroupsStore();

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

const groups = computed<string[]>(
  () => trainingGroupsStore.trainingGroups?.map((g) => g.name) ?? []
);

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
  Object.entries(training.value.participants ?? {})
    .map(([id, participant]) => ({
      id,
      ...participant,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
);

const participantGroups = computed<ParticipantGroup[]>(() => {
  const groupNames = [
    ...new Set([
      ...(training.value.groups ?? []),
      ...participants.value
        .map((participant) => participant.group)
        .filter((group): group is string => group !== undefined),
    ]),
  ];

  const groupedParticipants: ParticipantGroup[] = groupNames.map((name) => ({
    key: `assigned-${name}`,
    name,
    label: name,
    participants: participants.value.filter(
      (participant) => participant.group === name
    ),
  }));
  const unassignedParticipants = participants.value.filter(
    (participant) => participant.group === undefined
  );

  if (unassignedParticipants.length > 0) {
    groupedParticipants.push({
      key: "unassigned",
      name: undefined,
      label: "Ohne Gruppe",
      participants: unassignedParticipants,
    });
  }

  return groupedParticipants;
});

const selectableGroups = computed(
  () =>
    (training.value.groups ?? [])
      .concat(groups.value)
      .filter((value, index, self) => self.indexOf(value) === index) ?? []
);

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

const canBulkChangeParticipantGroups = computed(
  () => hasAnyRole(Acl.uebungImmerBearbeiten) && editAllowed.value
);

const bulkMoveTargetGroups = computed(() =>
  (training.value.groups ?? []).filter(
    (group) => group !== bulkMoveSourceGroup.value
  )
);

const addParticipantForm = ref<VForm>();

async function addParticipant() {
  if (!addParticipantForm.value) {
    return;
  }

  if ((await addParticipantForm.value.validate()).valid) {
    await trainingsStore.addParticipant(
      training.value.id,
      newParticipantName.value as string,
      newParticipantGroup.value
    );
    const name = newParticipantName.value;
    addParticipantForm.value.reset();
    addParticipantForm.value.resetValidation();
    if (training.value.groups?.length == 1) {
      newParticipantGroup.value = training.value.groups[0];
    }
    showMessage(`${name} hinzugefügt.`);
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

async function updateField<K extends keyof typeof training.value>(
  field: K,
  value: (typeof training.value)[K]
) {
  await trainingsStore.updateField(training.value.id, field, value);
}

function updateStartTime(newTime?: number) {
  updateField("startTime", newTime);
}

function updateEndTime(newTime?: number) {
  updateField("endTime", newTime);
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

function updateGroups(newGroups: string[]) {
  updateField("groups", newGroups);
  if (newGroups.length == 1) {
    newParticipantGroup.value = newGroups[0];
  } else {
    newParticipantGroup.value = undefined;
  }
}

function bulkMoveTargetGroupsFor(group: { name: string | undefined }) {
  return (training.value.groups ?? []).filter(
    (targetGroup) => targetGroup !== group.name
  );
}

function openBulkMoveDialog(group: {
  name: string | undefined;
  participants: (Participant & { readonly id: string })[];
}) {
  if (!canBulkChangeParticipantGroups.value) {
    return;
  }

  bulkMoveSourceGroup.value = group.name;
  bulkMoveParticipantCount.value = group.participants.length;
  bulkMoveTargetGroup.value =
    bulkMoveTargetGroups.value.length === 1
      ? bulkMoveTargetGroups.value[0]
      : undefined;
  bulkMoveDialog.value = true;
}

const bulkMoveSourceGroupLabel = computed(
  () => bulkMoveSourceGroup.value ?? "Ohne Gruppe"
);

function closeBulkMoveDialog() {
  if (bulkMoveSaving.value) {
    return;
  }
  bulkMoveDialog.value = false;
  bulkMoveSourceGroup.value = undefined;
  bulkMoveTargetGroup.value = undefined;
}

async function moveParticipantsToGroup() {
  const targetGroup = bulkMoveTargetGroup.value;
  if (
    !canBulkChangeParticipantGroups.value ||
    targetGroup === undefined ||
    targetGroup === bulkMoveSourceGroup.value ||
    !(training.value.groups ?? []).includes(targetGroup)
  ) {
    return;
  }

  const participantsToMove = participants.value.filter(
    (participant) => participant.group === bulkMoveSourceGroup.value
  );

  bulkMoveSaving.value = true;
  try {
    await Promise.all(
      participantsToMove.map((participant) =>
        trainingsStore.updateField(
          training.value.id,
          `participants/${participant.id}/group`,
          targetGroup
        )
      )
    );
    bulkMoveDialog.value = false;
  } finally {
    bulkMoveSaving.value = false;
  }
}

function close() {
  router.replace({ name: "TrainingHome" });
}

watchEffect(() => {
  if (training.value.groups?.length == 1) {
    newParticipantGroup.value = training.value.groups[0];
  }
});
</script>
