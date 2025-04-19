<template>
  <v-container>
    <v-row>
      <v-col cols="6"> </v-col>

      <v-col cols="6" class="d-flex justify-end align-center">
        <v-btn color="primary" @click="create">
          <v-icon start>mdi-plus</v-icon>
          Neu
        </v-btn>
      </v-col>
    </v-row>

    <v-data-iterator
      :items="people"
      :search="search"
      :items-per-page="12"
      :loading="loading"
      :page="page"
    >
      <template #header>
        <v-row class="mb-2">
          <v-col cols="12">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              clearable
              variant="solo"
              hide-details
              placeholder="Suche"
            ></v-text-field>
          </v-col>
        </v-row>
      </template>

      <template #default="{ items }">
        <v-row>
          <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title>
                {{ item.raw.id }}
              </v-card-title>
              <v-divider></v-divider>
              <v-list density="compact">
                <v-list-item>
                  Einsätze: {{ item.raw.recentCalloutsCount || 0 }}
                </v-list-item>
                <v-list-item
                  density="compact"
                  append-icon="mdi-pencil"
                  @click="edit(item.raw.id)"
                >
                  {{ item.raw.status }}
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template #footer="{ pageCount }">
        <v-pagination
          v-model="page"
          :length="pageCount"
          class="mt-4"
        ></v-pagination>
      </template>
    </v-data-iterator>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>

    <EditDialog
      v-model="showEditDialog"
      :person-id="personToBeEdited"
    ></EditDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import CreateDialog from "../components/CreatePersonDialog.vue";
import EditDialog from "../components/EditPersonDialog.vue";
import { usePeopleStore } from "../stores/people";

export default defineComponent({
  components: { CreateDialog, EditDialog },
  data() {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      personToBeEdited: "",
      search: "",
      page: 1,
    };
  },

  computed: {
    ...mapState(usePeopleStore, { storePeople: "people", loading: "loading" }),

    // Same as storePeople, but id is an enumerable property
    people() {
      return this.storePeople.map((person) => ({ ...person, id: person.id }));
    },
  },

  methods: {
    create() {
      this.showCreateDialog = true;
    },

    edit(id: string) {
      this.personToBeEdited = id;
      this.showEditDialog = true;
    },
  },
});
</script>
