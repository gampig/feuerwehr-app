<template>
  <v-container fluid>
    <v-row>
      <v-col cols="8">
        <v-checkbox
          v-model="showUnavailableTypes"
          label="Nicht mehr erhältliche anzeigen"
        ></v-checkbox>
      </v-col>

      <v-col cols="4" class="d-flex justify-end align-center">
        <v-btn color="primary" @click="addHandler">
          <v-icon start>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        v-model="selected"
        v-model:sort-by="sortBy"
        :headers="headers"
        :items="types"
        :search="search"
        :loading="loading"
        loading-text="Laden..."
        locale="de-DE"
        item-key="id"
      >
        <template #top>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            clearable
            density="compact"
            placeholder="Suche"
            class="pa-2"
          ></v-text-field>
        </template>

        <template #[`item.price`]="{ item }">
          <template v-if="item.price && item.price > 0">
            {{ item.price }} €
          </template>
          <template v-else>-</template>
        </template>

        <template #[`item.storageItemsCount`]="{ item }">
          <v-chip
            :color="item.storageItemsCount > 0 ? 'green' : 'red'"
            append-icon="mdi-pencil"
            label
            @click="storageHandler(item.id)"
          >
            {{ item.storageItemsCount }} Stück
          </v-chip>
        </template>

        <template #[`item.action`]="{ item }">
          <BaseActionCell :handle-edit="() => editHandler(item.id)">
          </BaseActionCell>
        </template>
      </v-data-table>
    </v-card>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>
    <EditDialog v-model="showEditDialog"></EditDialog>
    <StorageDialog
      :model-value="showStorageDialog"
      @update:model-value="onStorageDialogChanged"
      :clothing-type-id="storageDialogClothingTypeId"
    ></StorageDialog>
  </v-container>
</template>

<script lang="ts">
import CreateDialog from "../components/types/CreateDialog.vue";
import EditDialog from "../components/types/EditDialog.vue";
import { defineComponent } from "vue";
import { useClothingTypesStore } from "../stores/clothingTypes";
import { mapActions, mapState } from "pinia";
import { ClothingType } from "../models/ClothingType";
import { VueDatabaseQueryData } from "vuefire";
import { SortItem } from "@/models/SortItem";
import { useClothingStorageStore } from "../stores/clothingStorage";
import StorageDialog from "../components/storage/StorageDialog.vue";

const storageDialogHash = "#lager";

export default defineComponent({
  components: { CreateDialog, EditDialog, StorageDialog },

  data() {
    return {
      headers: [
        { title: "Kategorie", key: "category" },
        { title: "Bezeichnung", key: "name" },
        { title: "Preis", key: "price" },
        { title: "Art.-Nr.", key: "partNumber" },
        {
          title: "Lager",
          key: "storageItemsCount",
          nowrap: true,
          width: "1%",
          align: "end",
        },
        {
          title: "Aktionen",
          key: "action",
          sortable: false,
        },
      ] as const,

      sortBy: [
        { key: "category", order: "asc" },
        { key: "name", order: "asc" },
      ] as SortItem[],

      selected: [] as VueDatabaseQueryData<ClothingType>,
      search: "",
      showUnavailableTypes: false,
      storageDialogClothingTypeId: null as string | null,

      showCreateDialog: false,
      showEditDialog: false,
      showStorageDialog: false,
    };
  },

  computed: {
    ...mapState(useClothingTypesStore, {
      allTypes: "types",
      loading: "loading",
    }),

    ...mapState(useClothingStorageStore, ["clothingStorage"]),

    types() {
      const countStorageItems = (clothingTypeId: string): number =>
        (this.clothingStorage &&
          this.clothingStorage[clothingTypeId] &&
          Object.values(this.clothingStorage[clothingTypeId]).reduce(
            (partialSum, a) => partialSum + a,
            0
          )) ||
        0;
      return this.allTypes
        .filter((item) => item.isAvailable == !this.showUnavailableTypes)
        .map((item) => ({
          ...item,
          id: item.id,
          storageItemsCount: countStorageItems(item.id),
        }));
    },
  },

  watch: {
    "$route.hash": {
      handler: function (hash) {
        if (hash === storageDialogHash) {
          this.showStorageDialog = true;
        } else {
          this.showStorageDialog = false;
        }
      },

      immediate: true,
    },
  },

  methods: {
    ...mapActions(useClothingTypesStore, ["selectType"]),

    addHandler() {
      this.showCreateDialog = true;
    },

    editHandler(clothingTypeId: string) {
      this.selectType(clothingTypeId);
      this.showEditDialog = true;
    },

    storageHandler(clothingTypeId: string) {
      this.storageDialogClothingTypeId = clothingTypeId;
      this.$router.push(storageDialogHash);
    },

    onStorageDialogChanged(show: boolean) {
      if (!show) {
        this.$router.back();
      }
    },
  },
});
</script>
