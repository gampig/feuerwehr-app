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
        <v-btn @click="addHandler">
          <v-icon start>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <BaseSearchRow v-model:search="search" />

    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          v-model:sort-by="sortBy"
          :headers="headers"
          :items="types"
          :search="search"
          :loading="loading"
          loading-text="Laden..."
          class="elevation-1"
          locale="de-DE"
          item-key="id"
        >
          <template #[`item.price`]="{ item }">
            <template v-if="item.price && item.price > 0">
              {{ item.price }} €
            </template>
            <template v-else>-</template>
          </template>

          <template #[`item.action`]="{ item }">
            <BaseActionCell :handle-edit="() => editHandler(item.id)">
              <v-btn icon variant="text" @click="storageHandler(item)">
                <v-icon>mdi-wardrobe</v-icon>
              </v-btn>
            </BaseActionCell>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>
    <EditDialog v-model="showEditDialog"></EditDialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CreateDialog from "../components/types/CreateDialog.vue";
import EditDialog from "../components/types/EditDialog.vue";
import { defineComponent } from "vue";

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
      ],

      selected: [],
      search: "",
      showUnavailableTypes: false,

      showCreateDialog: false,
      showEditDialog: false,
    };
  },

  computed: {
    ...mapState("clothingTypes", { allTypes: "types", loading: "loading" }),

    types() {
      if (this.showUnavailableTypes) {
        return this.allTypes.filter((item) => !item.isAvailable);
      } else {
        return this.allTypes.filter((item) => item.isAvailable);
      }
    },
  },

  methods: {
    ...mapActions("clothingTypes", ["bindType"]),

    addHandler() {
      this.showCreateDialog = true;
    },

    editHandler(clothingTypeId) {
      this.bindType(clothingTypeId);
      this.showEditDialog = true;
    },

    storageHandler(item) {
      this.$router.push({
        name: "ClothesStorage",
        params: { id: item.id },
      });
    },
  },
});
</script>
