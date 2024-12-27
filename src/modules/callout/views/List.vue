<template>
  <v-container fluid>
    <BaseSearchRow v-model:search="search" />

    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model:sort-by="sortBy"
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
        { title: "Alarm", key: "alarmTimeFormatted", sort: sortDateTime },
        { title: "Stichwort", key: "keyword" },
        { title: "Schlagwort", key: "catchphrase" },
        { title: "Adresse", key: "address" },
        {
          title: "Aktionen",
          key: "action",
          sortable: false,
        },
      ],

      sortBy: [{ key: "alarmTimeFormatted", order: "desc" }] as Array<{
        key: string;
        order?: "asc" | "desc";
      }>,

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
