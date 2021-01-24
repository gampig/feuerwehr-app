<template>
  <BasePage page-title="Einsatz" navdrawer>
    <v-container class="fill-height" fluid>
      <v-row align="center">
        <v-col>
          <v-row justify="center" class="mb-6">
            <v-col sm="6" md="4">
              <v-btn :to="{ name: 'SelectCrew' }" color="primary" x-large block>
                Mannschaft eintragen
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-if="isAdmin" justify="center" class="mb-6">
            <v-col sm="6" md="4">
              <v-btn :to="{ name: 'SelectStandby' }" block>
                Bereitschaft eintragen
              </v-btn>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col sm="6" md="4">
              <v-btn :to="{ name: 'CalloutList' }" text block> Archiv </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
export default Vue.extend({
  computed: mapGetters("auth", ["isAdmin"]),
});
</script>
