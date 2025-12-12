<template>
  <BaseEditDialog
    :model-value="modelValue"
    title="Gruppen"
    height="100%"
    @update:model-value="cancel"
    @save="save"
  >
    <v-table>
      <tbody>
        <tr>
          <td>
            <v-text-field
              v-model="newGroupName"
              label="Neue Gruppe"
              variant="underlined"
            ></v-text-field>
          </td>
          <td>
            <v-btn
              color="primary"
              variant="flat"
              :disabled="!newGroupName"
              @click="addNewGroup"
              >Hinzufügen</v-btn
            >
          </td>
        </tr>
        <tr v-for="(group, index) in editedGroups" :key="group.name">
          <td>{{ group.name }}</td>
          <td width="1%" style="white-space: nowrap">
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="ma-1"
              @click="moveGroupUp(index)"
              ><v-icon>mdi-arrow-up</v-icon></v-btn
            >
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="ma-1"
              @click="moveGroupDown(index)"
              ><v-icon>mdi-arrow-down</v-icon></v-btn
            >
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="ma-1"
              @click="removeGroup(index)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>

    <BaseConfirmDialog
      v-model="confirmCancelDialog"
      title="Änderungen noch nicht gespeichert"
      confirm-text="Änderungen verwerfen"
      width="500"
      @confirm="closeThisDialog"
    >
      Einige Änderungen wurden noch nicht gespeichert.
      <br />Sollen die Änderungen wirklich verworfen werden?
    </BaseConfirmDialog>
  </BaseEditDialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useTrainingGroupsStore } from "../stores/trainingGroups";
import { TrainingGroup } from "../models/Training";

const { modelValue } = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:model-value"]);

const trainingGroupsStore = useTrainingGroupsStore();

const confirmCancelDialog = ref(false);
const dirty = ref(false);
const editedGroups = ref<TrainingGroup[]>([
  ...trainingGroupsStore.trainingGroups,
]);
const newGroupName = ref("");

function addNewGroup() {
  if (!newGroupName.value) {
    return;
  }

  dirty.value = true;
  editedGroups.value.push({ name: newGroupName.value });
  newGroupName.value = "";
}

function moveGroupUp(groupIndex: number) {
  dirty.value = true;
  const newIndex =
    groupIndex <= 0 ? editedGroups.value.length - 1 : groupIndex - 1;
  const f = editedGroups.value.splice(groupIndex, 1)[0];
  editedGroups.value.splice(newIndex, 0, f);
}

function moveGroupDown(groupIndex: number) {
  dirty.value = true;
  const newIndex =
    groupIndex >= editedGroups.value.length - 1 ? 0 : groupIndex + 1;
  const f = editedGroups.value.splice(groupIndex, 1)[0];
  editedGroups.value.splice(newIndex, 0, f);
}

function removeGroup(groupIndex: number) {
  dirty.value = true;
  editedGroups.value.splice(groupIndex, 1);
}

function reset() {
  dirty.value = false;
  newGroupName.value = "";
  editedGroups.value = [...trainingGroupsStore.trainingGroups];
}

async function save() {
  trainingGroupsStore.setGroups(editedGroups.value);
  emit("update:model-value", false);
}

function cancel() {
  if (dirty.value) {
    confirmCancelDialog.value = true;
  } else {
    closeThisDialog();
  }
}

function closeThisDialog() {
  confirmCancelDialog.value = false;
  emit("update:model-value", false);
}

watch(() => modelValue, reset);
</script>
