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
        :custom-filter="filterPeople"
        :items-per-page="12"
        :loading="loading"
      >
        <template #header>
          <v-row class="mb-2">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                clearable
                solo
                hide-details
                label="Suche"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="selectedStatus"
                clearable
                solo
                hide-details
                label="Status"
                :items="availableStatusValues"
              >
              </v-select>
            </v-col>
          </v-row>
        </template>

        <template #default="{ items }">
          <v-row>
            <v-col
              v-for="item in items"
              :key="item.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card>
                <v-card-title>
                  {{ item.id }}
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item dense @click="edit(item.id)">
                    <v-list-item-content>
                      {{ item.status }}
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
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
import Vue from "vue";
import { mapState } from "vuex";
import CreateDialog from "../components/CreateDialog.vue";
import EditDialog from "../components/EditDialog.vue";
/* eslint-disable no-unused-vars */
import {
  Person,
  ALL_PERSON_STATUS_VALUES,
} from "../../fireDepartment/models/Person";
/* eslint-enable */

export default Vue.extend({
  components: { CreateDialog, EditDialog },
  data() {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      personToBeEdited: "",
      search: "",
      selectedStatus: null,
      availableStatusValues: ALL_PERSON_STATUS_VALUES,
    };
  },

  computed: {
    ...mapState("people", ["people", "loading"]),
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

    filterPeople(items: Person[], search: string) {
      return items.filter(
        (item) =>
          (!this.selectedStatus || item.status === this.selectedStatus) &&
          (!search || item.id.toLowerCase().includes(search.toLowerCase()))
      );
    },

    reloadPeople() {
      this.$store.dispatch("people/bindPeople");
    },
  },
});
</script>
