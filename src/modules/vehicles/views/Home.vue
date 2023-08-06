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
/* eslint-disable */
import { FeuerwehrGeraeteSettings } from "@/modules/appSettings/models/AppSettings";
/* eslint-enable */
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
  computed: {
    ...mapState("appSettings", ["feuerwehrGeraete"]),

    showMapButton(): boolean {
      return (
        ((this.feuerwehrGeraete as FeuerwehrGeraeteSettings | undefined)
          ?.fahrzeugPositionenLink?.length ?? 0) > 0
      );
    },
  },

  methods: {
    showMap() {
      var link = (this.feuerwehrGeraete as FeuerwehrGeraeteSettings | undefined)
        ?.fahrzeugPositionenLink;
      if (link) {
        window.open(link, "_blank");
      }
    },
  },
});
</script>
