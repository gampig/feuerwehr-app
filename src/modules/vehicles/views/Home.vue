<template>
  <BasePage page-title="Fahrzeuge" navdrawer>
    <v-container>
      <v-row>
        <v-col>
          <v-btn v-if="showMapButton" @click="showMap">
            <v-icon left>mdi-map</v-icon>
            Karte
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import { useAppSettingsStore } from "@/modules/appSettings/stores/appSettings";
import { mapState } from "pinia";
import Vue from "vue";

export default Vue.extend({
  computed: {
    ...mapState(useAppSettingsStore, ["feuerwehrGeraete"]),

    showMapButton(): boolean {
      return (this.feuerwehrGeraete?.fahrzeugPositionenLink?.length ?? 0) > 0;
    },
  },

  methods: {
    showMap() {
      var link = this.feuerwehrGeraete?.fahrzeugPositionenLink;
      if (link) {
        window.open(link, "_blank");
      }
    },
  },
});
</script>
