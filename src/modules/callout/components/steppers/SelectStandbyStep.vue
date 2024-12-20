<template>
  <v-card class="ma-1" :loading="loadingCallout">
    <v-card-title>Bereitschaft</v-card-title>
    <v-card-subtitle v-if="callout">
      {{ callout.keyword }} -
      {{ formatDateTimeFromNow(callout.alarmTime) }}
      ({{ formatDateTime(callout.alarmTime) }})
    </v-card-subtitle>

    <v-divider v-if="callout"></v-divider>

    <v-card-text v-if="callout">
      <PersonAutocomplete
        :loading="loading"
        @input="onAdd"
      ></PersonAutocomplete>

      <div class="mb-4 ml-2">
        {{ crewCount == 1 ? "1 Person" : `${crewCount} Personen` }} ausgewählt
      </div>

      <v-chip
        v-for="(val, person) in crew"
        :key="person + 0"
        color="secondary"
        class="ma-1"
        closable
        @click:close="onRemove(person)"
        >{{ person }}</v-chip
      >
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn variant="text" @click="back"> Zurück </v-btn>
      <v-spacer />
      <v-btn color="primary" @click="showDoneNotice = true">Fertig</v-btn>
    </v-card-actions>

    <v-dialog v-model="showDoneNotice" max-width="700">
      <v-card>
        <v-card-title>
          Bitte dieses Programm (FeuerwehrApp) schließen.
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDoneNotice = false"
            >Abbrechen</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <BaseConfirmDialog
      v-model="showRemoveDialog"
      confirm-text="Entfernen"
      @confirm="onRemoveConfirmed"
    >
      Soll <strong>{{ personToRemove }}</strong> wirklich vom Einsatz entfernt
      werden?
    </BaseConfirmDialog>
  </v-card>
</template>

<script>
import { formatDateTime, formatDateTimeFromNow } from "@/utils/dates";
import { mapState, mapActions, mapGetters } from "vuex";
import PersonAutocomplete from "../form/PersonAutocomplete.vue";

export default {
  components: { PersonAutocomplete },

  data() {
    return {
      loading: false,
      showDoneNotice: false,
      showRemoveDialog: false,
      personToRemove: null,
    };
  },

  computed: {
    ...mapState("callout", { callout: "callout", loadingCallout: "loading" }),
    ...mapGetters("callout", { crew: "standbyCrew" }),

    crewCount() {
      if (!this.crew) {
        return 0;
      }

      return Object.keys(this.crew).length;
    },
  },

  methods: {
    ...mapActions("callout", {
      addStandbyMember: "addStandbyMember",
      removeStandbyMember: "removeStandbyMember",
    }),

    onAdd(item) {
      this.loading = true;
      const personId = item.id;

      this.addStandbyMember(personId).finally(() => {
        this.loading = false;
      });
    },

    onRemove(item) {
      this.personToRemove = item;
      this.showRemoveDialog = true;
    },

    onRemoveConfirmed() {
      if (this.personToRemove) {
        this.removeStandbyMember(this.personToRemove);
      } else {
        throw new Error(
          "Konnte Person nicht entfernen wegen einem internen Fehler (personToRemove darf nicht NULL sein)."
        );
      }
    },

    back() {
      this.$emit("back");
    },

    formatDateTime: formatDateTime,
    formatDateTimeFromNow: formatDateTimeFromNow,
  },
};
</script>
