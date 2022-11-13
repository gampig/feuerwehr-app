<template>
  <BasePage page-title="Datenexport" navdrawer>
    <v-container class="full-height" fluid>
      <v-row align="center">
        <v-col>
          <v-row justify="center" class="mb-6">
            <v-col sm="6" md="4">
              <v-btn @click="exportPeople">Personenliste speichern</v-btn>
            </v-col>
          </v-row>

          <v-row justify="center" class="mb-6">
            <v-col sm="6" md="4">
              <v-btn
                :loading="exportingMannschaftsbuch"
                @click="exportMannschaftsbuch"
                >Mannschaftsbuch speichern</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import Vue from "vue";
import {
  exportPeopleWithStatus,
  exportMannschaftsbuch,
} from "../services/exportService";
import { saveAsCsv } from "../services/csvService";

export default Vue.extend({
  data() {
    return {
      exportingMannschaftsbuch: false,
    };
  },

  methods: {
    exportPeople() {
      const people = this.$store.state.people.people;

      const data = exportPeopleWithStatus(people);
      saveAsCsv(data);
    },

    exportMannschaftsbuch() {
      this.exportingMannschaftsbuch = true;
      exportMannschaftsbuch()
        .then((data) => {
          saveAsCsv(data, "Mannschaftsbuch.csv");
        })
        .catch((e: Error) => {
          this.$showError(e.message);
        })
        .finally(() => {
          this.exportingMannschaftsbuch = false;
        });
    },
  },
});
</script>
