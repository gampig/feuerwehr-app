<template>
  <BaseListPage page-title="Einsatz-Archiv" :search.sync="search">
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
        <v-chip v-for="(val, type) in item.type" :key="type" class="ma-1">{{
          type
        }}</v-chip>
      </template>
      <BaseActionCell
        slot="item.action"
        slot-scope="props"
        :handle-show="() => showHandler(props.item)"
      />
    </v-data-table>
  </BaseListPage>
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
});
</script>
