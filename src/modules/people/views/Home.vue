<template>
  <BasePage page-title="Personen" navdrawer>
    <template #actions>
      <v-btn icon @click="reloadPeople"><v-icon>mdi-reload</v-icon></v-btn>

      <v-btn icon @click="create"><v-icon>mdi-plus</v-icon></v-btn>
    </template>

    <v-container>
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
                label="Suche"
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
    </v-container>

    <CreateDialog v-model="showCreateDialog"></CreateDialog>

    <EditDialog
      v-model="showEditDialog"
      :person-id="personToBeEdited"
    ></EditDialog>
  </BasePage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import CreateDialog from "../components/CreateDialog.vue";
import EditDialog from "../components/EditDialog.vue";
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
    ...mapState(usePeopleStore, ["people", "loading"]),
  },

  watch: {
    showCreateDialog(show) {
      if (!show) {
        this.reloadPeople();
      }
    },

    showEditDialog(show) {
      if (!show) {
        this.reloadPeople();
      }
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

    reloadPeople() {
      usePeopleStore().bindPeople();
    },
  },
});
</script>
