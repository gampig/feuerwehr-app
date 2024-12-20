<template>
  <v-container fluid>
    <BaseSearchRow v-model:search="search" />

    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          v-model:options="options"
          :headers="headers"
          :items="callouts"
          :search="search"
          :loading="loading"
          loading-text="Laden..."
          class="elevation-1"
          locale="de-DE"
          item-key="id"
        >
          <template #[`item.type`]="{ item }">
            <v-chip v-for="(val, type) in item.type" :key="type" class="ma-1">{{
              type
            }}</v-chip>
          </template>
          <template #[`item.action`]="{ item }">
            <BaseActionCell :handle-show="() => showHandler(item)" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { mapGetters, mapState } from "vuex";
import { defineComponent } from "vue";
import { Callout } from "../models/Callout";
import { sortDateTime } from "@/utils/dates";

export default defineComponent({
  data() {
    return {
      headers: [
        { text: "Alarm", value: "alarmTimeFormatted", sort: sortDateTime },
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
    ...mapState("callouts", ["loading"]),
  },

  methods: {
    showHandler(item: Callout) {
      this.$router.push({
        name: "CalloutShow",
        params: { id: item.id },
      });
    },
  },
});
</script>
