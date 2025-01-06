<template>
  <v-dialog
    :model-value="modelValue"
    transition="dialog-bottom-transition"
    fullscreen
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar>
        <v-btn
          icon="mdi-close"
          @click="emit('update:modelValue', false)"
        ></v-btn>

        <v-toolbar-title>Lager: {{ type?.name }}</v-toolbar-title>

        <v-spacer />

        <v-dialog v-model="addDialog" width="auto">
          <template #activator="{ props }">
            <v-btn icon="mdi-plus" v-bind="props"></v-btn>
          </template>
          <v-card>
            <v-card-title> Kleidungsstücke hinzufügen </v-card-title>
            <v-card-text>
              <VForm ref="addForm">
                <v-combobox
                  v-model="newSize"
                  label="Größe"
                  prepend-icon="mdi-ruler"
                  :rules="[required]"
                  :items="(type && type.sizes) || []"
                />
                <v-text-field
                  v-model="newCount"
                  type="number"
                  min="1"
                  label="Anzahl"
                  prepend-icon="mdi-hanger"
                  :rules="[required]"
                />
              </VForm>
            </v-card-text>
            <v-card-actions>
              <v-btn variant="text" @click="closeAddDialog">Abbrechen</v-btn>
              <v-spacer />
              <v-btn variant="text" color="primary" @click="onAdd">
                Speichern
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <v-container>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            loading-text="Laden..."
            locale="de-DE"
          >
            <template #[`item.action`]="{ item }">
              <v-btn icon variant="text" @click="showEditDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-container>

      <v-dialog v-model="editDialog" persistent width="auto">
        <v-card>
          <v-card-title>Anzahl ändern</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editCount"
              prepend-icon="mdi-minus"
              append-icon="mdi-plus"
              type="number"
              min="0"
              label="Anzahl"
              @click:prepend="decrementCount"
              @click:append="incrementCount"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeEditDialog">Abbrechen</v-btn>
            <v-spacer />
            <v-btn @click="onEdit">Speichern</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import { required } from "@/utils/rules";
import { computed, ComputedRef, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useClothingStorageStore } from "../../stores/clothingStorage";
import { useClothingTypesStore } from "../../stores/clothingTypes";
import { storeToRefs } from "pinia";

interface ListItem {
  size: string;
  count: number;
}

const { modelValue, clothingTypeId } = defineProps<{
  modelValue: boolean;
  clothingTypeId: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const addForm = ref<VForm>();
const adding = ref(false);
const search = ref<string>();
const addDialog = ref(false);
const editDialog = ref(false);
const newSize = ref<string>();
const newCount = ref<string>("1");
const editSize = ref<string>();
const editCount = ref<string>();

const headers = [
  { title: "Größe", key: "size" },
  { title: "Anzahl", key: "count" },
  {
    title: "Aktionen",
    key: "action",
    sortable: false,
  },
];

const clothingTypesStore = useClothingTypesStore();
const clothingStorageStore = useClothingStorageStore();

const { selectedType: type } = storeToRefs(clothingTypesStore);
const { clothingStorage } = storeToRefs(clothingStorageStore);

const loading = computed(
  () => clothingTypesStore.selectedTypeLoading || clothingStorageStore.loading
);

const storeItems = computed(
  () =>
    (clothingStorage.value &&
      clothingTypeId &&
      clothingStorage.value[clothingTypeId]) ||
    {}
);

const items: ComputedRef<ListItem[]> = computed(() =>
  Object.entries(storeItems.value).map(([size, count]) => ({
    size: size,
    count: count,
  }))
);

function bindType(id: string) {
  clothingTypesStore.selectType(id);
}
function setCount(clothingTypeId: string, size: string, count: number) {
  const countOrNull = count > 0 ? count : null;
  return clothingStorageStore.set(clothingTypeId, size, countOrNull);
}

function decrementCount() {
  if (editCount.value === undefined) {
    editCount.value = "0";
  } else {
    const oldCount = Number(editCount.value);
    if (oldCount > 0) {
      editCount.value = (oldCount - 1).toString();
    }
  }
}

function incrementCount() {
  if (editCount.value === undefined) {
    editCount.value = "1";
  } else {
    const oldCount = Number(editCount.value);
    editCount.value = (oldCount + 1).toString();
  }
}

function closeAddDialog() {
  addDialog.value = false;
  nextTick(() => {
    newSize.value = undefined;
    newCount.value = "1";
  });
}

async function onAdd() {
  if (!addForm.value) {
    return;
  }

  if (
    (await addForm.value.validate()).valid &&
    clothingTypeId &&
    newSize.value
  ) {
    adding.value = true;

    const existingCount = storeItems.value && storeItems.value[newSize.value];
    const count = existingCount
      ? existingCount + Number(newCount.value)
      : Number(newCount.value);

    setCount(clothingTypeId, newSize.value, count).finally(() => {
      addDialog.value = false;
      adding.value = false;
      newSize.value = undefined;
      newCount.value = "1";
    });
  }
}

function showEditDialog(item: ListItem) {
  editSize.value = item.size;
  editCount.value = item.count.toString();
  editDialog.value = true;
}

function closeEditDialog() {
  editDialog.value = false;
  nextTick(() => {
    editSize.value = undefined;
    editCount.value = undefined;
  });
}

function onEdit() {
  if (!clothingTypeId || !editSize.value) {
    return;
  }

  const count = editCount.value == undefined ? 0 : Number(editCount.value);
  setCount(clothingTypeId, editSize.value, count);
  closeEditDialog();
}

function retrieveItem() {
  if (clothingTypeId) {
    bindType(clothingTypeId);
  }
}

onMounted(retrieveItem);

watch(() => clothingTypeId, retrieveItem);
</script>
