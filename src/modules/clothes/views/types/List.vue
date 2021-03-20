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
          <v-icon left>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <BaseSearchRow :search.sync="search" />

    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="types"
          :search="search"
          :loading="loading"
          loading-text="Laden..."
          :options.sync="options"
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

          <BaseActionCell
            slot="item.action"
            slot-scope="props"
            :handle-edit="() => editHandler(props.item)"
          >
            <v-btn icon @click="storageHandler(props.item)">
              <v-icon>mdi-wardrobe</v-icon>
            </v-btn>
          </BaseActionCell>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import makeListMixin from "@/mixins/ListMixin";

export default makeListMixin("ClothesType", "clothingTypes").extend({
  data() {
    return {
      headers: [
        { text: "Kategorie", value: "category" },
        { text: "Hersteller", value: "manufacturer" },
        { text: "Bezeichnung", value: "name" },
        { text: "Preis", value: "price" },
        {
          text: "Aktionen",
          value: "action",
          sortable: false,
        },
      ],
      options: {
        sortBy: ["category", "manufacturer"],
        sortDesc: [false, false],
        page: 1,
        itemsPerPage: 15,
      },

      selected: [],
      search: "",
      showUnavailableTypes: false,
    };
  },

  computed: {
    ...mapState("clothingTypes", { allTypes: "types" }),

    types() {
      if (this.showUnavailableTypes) {
        return this.allTypes.filter((item) => !item.isAvailable);
      } else {
        return this.allTypes.filter((item) => item.isAvailable);
      }
    },
  },

  methods: {
    storageHandler(item) {
      this.$router.push({
        name: "ClothesStorage",
        params: { id: item.id },
      });
    },
  },
});
</script>
