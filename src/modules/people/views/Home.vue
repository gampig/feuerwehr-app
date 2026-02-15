<template>
  <BasePage page-title="Personen" navdrawer>
    <template #actions>
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
                    <br />
                    Übungen: {{ item.raw.recentTrainingsCount || 0 }}
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

<script setup lang="ts">
import { ref, computed } from "vue";
import CreateDialog from "../components/CreateDialog.vue";
import EditDialog from "../components/EditDialog.vue";
import { usePeopleStore } from "../stores/people";

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const personToBeEdited = ref("");
const search = ref("");
const page = ref(1);

const peopleStore = usePeopleStore();

const loading = computed(() => peopleStore.loading);

const people = computed(() =>
  (peopleStore.people ?? [])
    // Needed to make the id field enumerable
    .map((person: any) => ({
      ...person,
      id: person.id,
    }))
);

function create() {
  showCreateDialog.value = true;
}

function edit(id: string) {
  personToBeEdited.value = id;
  showEditDialog.value = true;
}
</script>
