<template>
  <BasePage page-title="Einsatz-Archiv" navdrawer>
    <v-container fluid>
      <BaseSearchRow :search.sync="search" />

      <v-row>
        <v-col cols="12">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="callouts"
            :search="search"
            :loading="loading"
            loading-text="Laden..."
            :options.sync="options"
            class="elevation-1"
            locale="de-DE"
            item-key="id"
          >
            <template #[`item.type`]="{ item }">
              <v-chip
                v-for="(val, type) in item.type"
                :key="type"
                class="ma-1"
                >{{ type }}</v-chip
              >
            </template>
            <template #[`item.action`]="{ item }">
              <BaseActionCell :handle-show="() => showHandler(item)" />
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </BasePage>
</template>

<script>
import { mapGetters } from "vuex";
import makeListMixin from "@/mixins/ListMixin";

export default makeListMixin("Callout", "callouts").extend({
  data() {
    return {
      headers: [
        { text: "Alarm", value: "alarmTimeFormatted", sort: this.sortDateTime },
        { text: "Stichwort", value: "keyword" },
        { text: "Schlagwort", value: "catchphrase" },
        { text: "Adresse", value: "address" },
        {
          text: "Aktionen",
          value: "action",
          sortable: false,
        },
      ],
      selected: [],
      options: {
        sortBy: ["alarmTimeFormatted"],
        sortDesc: [true],
        page: 1,
        itemsPerPage: 15,
      },
      search: "",
    };
  },

  computed: {
    ...mapGetters("callouts", { callouts: "calloutsWithFormattedDateTime" }),
  },

  created() {
    if (!this.$store.state.callouts.allCalloutsLoaded) {
      this.$store.dispatch("callouts/bind", { loadAllCallouts: true });
    }
  },
});
</script>
