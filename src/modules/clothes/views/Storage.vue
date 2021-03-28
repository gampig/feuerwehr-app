<template>
  <BaseListPage
    page-title="Lager"
    :search.sync="search"
    :handle-add="() => (showAddDialog = true)"
  >
    <template v-if="type" #topRow>
      <v-col cols="12">
        <v-card color="secondary" dark>
          <v-card-title>
            {{ type.manufacturer }}: {{ type.name }}
          </v-card-title>
        </v-card>
      </v-col>
    </template>

    <v-data-table
      :headers="headers"
      :items="clothingItems"
      :search="search"
      :loading="loading"
      loading-text="Laden..."
      class="elevation-1"
      locale="de-DE"
      item-key="size"
    >
      <template #[`item.action`]="{ item }">
        <v-edit-dialog
          :return-value.sync="item.count"
          cancel-text="Abbrechen"
          save-text="Speichern"
          large
          persistent
          @save="onEdit(item)"
        >
          <v-btn icon><v-icon>mdi-pencil</v-icon></v-btn>
          <template #input>
            <div class="mt-4 title">Anzahl ändern</div>
            <v-text-field
              v-model="item.count"
              prepend-icon="mdi-minus"
              append-outer-icon="mdi-plus"
              type="number"
              min="0"
              label="Anzahl"
              single-line
              @click:prepend="decrementCount(item)"
              @click:append-outer="incrementCount(item)"
            />
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>

    <v-dialog v-model="showAddDialog" max-width="600px" persistent>
      <v-form ref="addForm">
        <v-card>
          <v-card-title>Kleidungsstücke hinzufügen</v-card-title>
          <v-card-text>
            <v-combobox
              v-model="newSize"
              label="Größe"
              prepend-icon="mdi-ruler"
              :rules="[rules.required]"
              :items="(type && type.sizes) || []"
            />
            <v-text-field
              v-model="newCount"
              type="number"
              min="1"
              label="Anzahl"
              prepend-icon="mdi-hanger"
              :rules="[rules.required]"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="showAddDialog = false">
              Abbrechen
            </v-btn>
            <v-spacer />
            <v-btn text color="primary" :loading="adding" @click="onAdd">
              Speichern
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </BaseListPage>
</template>

<script>
import makeUpdateMixin from "@/mixins/UpdateMixin";
import { mapActions, mapState } from "vuex";

export default makeUpdateMixin("", "").extend({
  data() {
    return {
      rules: {
        required: (value) => !!value || "Bitte fülle dieses Feld aus",
      },

      loading: false,
      clothingItems: [],

      showAddDialog: false,
      adding: false,
      newSize: "",
      newCount: 1,

      headers: [
        { text: "Größe", value: "size" },
        { text: "Anzahl", value: "count" },
        {
          text: "Aktionen",
          value: "action",
          sortable: false,
        },
      ],
      search: "",
    };
  },

  computed: {
    ...mapState("clothingTypes", ["type"]),
    ...mapState("clothingStorage", { remoteClothingItems: "clothingItems" }),
  },

  destroyed() {
    this.unbindType();
    this.unbindStorage();
  },

  methods: {
    ...mapActions("clothingTypes", ["bindType", "unbindType"]),
    ...mapActions("clothingStorage", {
      bindStorage: "bind",
      unbindStorage: "unbind",
      setCount: "set",
    }),

    decrementCount(item) {
      if (item.count > 0) item.count -= 1;
    },
    incrementCount(item) {
      item.count += 1;
    },

    onAdd() {
      if (this.$refs.addForm.validate()) {
        this.adding = true;

        const existingItem = this.clothingItems.find(
          (clothingItem) => clothingItem.size === this.newSize
        );
        const count = existingItem
          ? Number(existingItem.count) + Number(this.newCount)
          : this.newCount;

        this.setCount({ size: this.newSize, count: count }).finally(() => {
          this.resetItems();
          this.showAddDialog = false;
          this.adding = false;
          this.newSize = "";
          this.newCount = 1;
        });
      }
    },

    onEdit(item) {
      this.setCount(item).finally(() => {
        this.resetItems();
      });
    },

    retrieveItem() {
      this.loading = true;
      Promise.all([this.bindType(this.id), this.bindStorage(this.id)]).finally(
        () => {
          this.loading = false;
          this.resetItems();
        }
      );
    },
    resetItems() {
      this.clothingItems = this.remoteClothingItems.map((item) => {
        return { ...item };
      });
    },
  },
});
</script>
