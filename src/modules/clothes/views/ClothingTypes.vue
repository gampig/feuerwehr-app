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

        <template #[`item.action`]="{ item }">
          <BaseActionCell :handle-edit="() => editHandler(item.id)">
            <v-btn icon variant="text" @click="storageHandler(item.id)">
              <v-icon>mdi-wardrobe</v-icon>
            </v-btn>
          </BaseActionCell>
        </template>
      </v-data-table>
    </v-card>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>
    <EditDialog v-model="showEditDialog"></EditDialog>
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

export default defineComponent({
  components: { CreateDialog, EditDialog },

  data() {
    return {
      headers: [
        { title: "Kategorie", key: "category" },
        { title: "Bezeichnung", key: "name" },
        { title: "Preis", key: "price" },
        {
          title: "Aktionen",
          key: "action",
          sortable: false,
        },
      ],

      sortBy: [
        { key: "category", order: "asc" },
        { key: "name", order: "asc" },
      ] as SortItem[],

      selected: [] as VueDatabaseQueryData<ClothingType>,
      search: "",
      showUnavailableTypes: false,

      showCreateDialog: false,
      showEditDialog: false,
    };
  },

  computed: {
    ...mapState(useClothingTypesStore, {
      allTypes: "types",
      loading: "loading",
    }),

    types() {
      if (this.showUnavailableTypes) {
        return this.allTypes.filter((item) => !item.isAvailable);
      } else {
        return this.allTypes.filter((item) => item.isAvailable);
      }
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
      this.$router.push({
        name: "ClothesStorage",
        params: { id: clothingTypeId },
      });
    },
  },
});
</script>
