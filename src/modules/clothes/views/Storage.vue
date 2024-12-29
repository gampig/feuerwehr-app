<template>
  <BasePage page-title="Lager" close-button>
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
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>
                {{ type?.name }}
              </v-toolbar-title>
              <v-spacer />
              <v-dialog v-model="addDialog" width="auto">
                <template #activator="{ props }">
                  <v-btn color="primary" v-bind="props">Hinzufügen</v-btn>
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
                    <v-btn variant="text" @click="closeAddDialog"
                      >Abbrechen</v-btn
                    >
                    <v-spacer />
                    <v-btn variant="text" color="primary" @click="onAdd">
                      Speichern
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
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
  </BasePage>
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import { required } from "@/utils/rules";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { ClothingItem } from "../models/ClothingItem";
import { useRoute } from "vue-router";
import { useClothingStorageStore } from "../stores/clothingStorage";
import { useClothingTypesStore } from "../stores/clothingTypes";
import { storeToRefs } from "pinia";

const addForm = ref<VForm>();
const adding = ref(false);
const search = ref<string>();
const addDialog = ref(false);
const editDialog = ref(false);
const newSize = ref<string>();
const newCount = ref<string>("1");
const editItem = ref<ClothingItem>();
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

const route = useRoute();
const clothingTypesStore = useClothingTypesStore();
const clothingStorageStore = useClothingStorageStore();

const { selectedType: type } = storeToRefs(clothingTypesStore);
const { clothingItems: items } = storeToRefs(clothingStorageStore);
const id = route.params.id as string;

const loading = computed(
  () => clothingTypesStore.selectedTypeLoading || clothingStorageStore.loading
);

function bindType(id: string) {
  clothingTypesStore.selectType(id);
}
function unbindType() {
  clothingTypesStore.selectType();
}
function bindStorage(id: string) {
  clothingStorageStore.selectClothingType(id);
}
function unbindStorage() {
  clothingStorageStore.selectClothingType();
}
function setCount(item: ClothingItem) {
  return clothingStorageStore.set(item);
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

  if ((await addForm.value.validate()).valid && newSize.value) {
    adding.value = true;

    const existingItem = items.value.find(
      (clothingItem) => clothingItem.size === newSize.value
    );
    const count = existingItem
      ? existingItem.count + Number(newCount.value)
      : Number(newCount.value);

    setCount({ size: newSize.value, count: count }).finally(() => {
      addDialog.value = false;
      adding.value = false;
      newSize.value = undefined;
      newCount.value = "1";
    });
  }
}

function showEditDialog(item: ClothingItem) {
  editItem.value = item;
  editCount.value = item.count.toString();
  editDialog.value = true;
}

function closeEditDialog() {
  editDialog.value = false;
  nextTick(() => {
    editItem.value = undefined;
    editCount.value = undefined;
  });
}

function onEdit() {
  if (!editItem.value) {
    return;
  }

  const count = editCount.value === undefined ? 0 : Number(editCount.value);
  const item: ClothingItem = {
    ...editItem.value,
    count: count,
  };
  setCount(item);
  closeEditDialog();
}

function retrieveItem() {
  bindStorage(id);
  bindType(id);
}

onMounted(retrieveItem);
onUnmounted(() => {
  unbindType();
  unbindStorage();
});

watch(() => id, retrieveItem);
</script>
