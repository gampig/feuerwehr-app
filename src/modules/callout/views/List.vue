<template>
  <v-container fluid>
    <BaseSearchRow v-model:search="search">
      <v-col
        v-if="canDeleteMultipleCallouts"
        class="d-flex justify-end align-center"
      >
        <v-btn
          color="secondary"
          :disabled="selected.length == 0"
          :loading="deleting"
          @click="confirmDeleteDialog = true"
        >
          Löschen
        </v-btn>
      </v-col>
    </BaseSearchRow>

    <v-row>
      <v-col cols="12">
        <v-data-table
          v-model="selected"
          v-model:sort-by="sortBy"
          :headers="headers"
          :items="callouts"
          :search="search"
          :loading="loading"
          loading-text="Laden..."
          class="elevation-1"
          locale="de-DE"
          item-key="id"
          item-selectable="selectable"
          :show-select="canDeleteMultipleCallouts"
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

    <BaseConfirmDialog
      v-model="confirmDeleteDialog"
      title="Löschen bestätigen"
      width="500"
      @confirm="deleteSelected"
    >
      Möchtest du die {{ selected.length }} ausgewählten Einsätze wirklich
      löschen?
    </BaseConfirmDialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Callout } from "../models/Callout";
import { sortDateTime } from "@/utils/dates";
import { mapActions, mapState } from "pinia";
import { useCalloutsStore } from "../stores/callouts";
import { VueDatabaseDocumentData } from "vuefire";
import { SortItem } from "@/models/SortItem";
import handleError from "@/utils/store/handleError";
import { showMessage } from "@/utils/notifications";
import moment from "moment";
import { useAuthStore } from "@/stores/auth";

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

      sortBy: [{ key: "alarmTimeFormatted", order: "desc" }] as SortItem[],

      search: "",
      selected: [] as string[],
      confirmDeleteDialog: false,
      deleting: false,
    };
  },

  computed: {
    ...mapState(useCalloutsStore, {
      loading: "loading",
      storeCallouts: "calloutsWithFormattedDateTime",
    }),

    callouts() {
      return this.storeCallouts.map((callout) => ({
        ...callout,
        id: callout.id,
        selectable: callout.alarmTime < moment().subtract(1, "day").unix(),
      }));
    },

    canDeleteMultipleCallouts() {
      return this.hasAnyRole(["ROLE_ADMIN"]);
    },
  },

  methods: {
    ...mapActions(useCalloutsStore, ["remove"]),
    ...mapActions(useAuthStore, ["hasAnyRole"]),

    showHandler(item: NonNullable<VueDatabaseDocumentData<Callout>>) {
      this.$router.push({
        name: "CalloutShow",
        params: { id: item.id },
      });
    },

    async deleteSelected() {
      try {
        const selected = [...this.selected];
        this.deleting = true;
        for (const calloutId of selected) {
          await this.remove(calloutId);
        }
        showMessage(`${selected.length} Einsätze gelöscht`, "success");
        this.selected = [];
      } catch (e) {
        handleError(e);
      } finally {
        this.deleting = false;
      }
    },
  },
});
</script>
